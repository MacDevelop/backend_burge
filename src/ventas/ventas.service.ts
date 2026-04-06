import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from '../productos/entities/producto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private dataSource: DataSource,
  ) {}

  async obtenerVentas(): Promise<Venta[]> {
    console.log('Obteniendo todas las ventas...');
    const ventas = await this.ventaRepository.find({
      order: { fechaCreacion: 'DESC' },
      relations: ['usuario', 'ventadetalles', 'ventadetalles.producto'],
    });
    console.log('Ventas obtenidas:', ventas);
    return ventas.map((venta) => plainToClass(Venta, venta));
  }

  async obtenerVentaPorId(id: number): Promise<Venta> {
    console.log(`Buscando venta por ID: ${id}`);
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['usuario', 'ventadetalles', 'ventadetalles.producto'],
    });

    if (!venta) {
      console.log(`No se encontró la venta con ID: ${id}`);
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    console.log('Venta encontrada:', venta);
    return plainToClass(Venta, venta);
  }

  async obtenerVentaDetalles(id: number): Promise<DetalleVenta[]> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['ventadetalles', 'ventadetalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    if (!venta.ventadetalles || venta.ventadetalles.length === 0) {
      throw new NotFoundException(
        `No se encontraron detalles para la venta con ID ${id}`,
      );
    }

    return venta.ventadetalles.map((detalle) =>
      plainToClass(DetalleVenta, detalle),
    );
  }

  async crearVenta(createVentaDto: CreateVentaDto): Promise<Venta> {
    console.log('Iniciando creación de venta con DTO:', createVentaDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let usuario = null;
      if (createVentaDto.idUsuario) {
        console.log(`Buscando usuario con ID: ${createVentaDto.idUsuario}`);
        usuario = await this.usuarioRepository.findOne({
          where: { id: createVentaDto.idUsuario },
        });
        if (!usuario) {
          console.log(
            `Usuario con ID ${createVentaDto.idUsuario} no encontrado`,
          );
          throw new NotFoundException(
            `Usuario con ID ${createVentaDto.idUsuario} no encontrado`,
          );
        }
        console.log('Usuario encontrado:', usuario);
      }

      // Validar montoPagado en el DTO
      if (
        typeof createVentaDto.montoPagado !== 'number' ||
        isNaN(createVentaDto.montoPagado) ||
        createVentaDto.montoPagado < 0
      ) {
        throw new BadRequestException(
          'El monto pagado debe ser un número positivo',
        );
      }

      const nuevaVenta = this.ventaRepository.create({
        metodoPago: createVentaDto.metodoPago,
        totalVenta: 0,
        estado: 'realizada',
        montoPagado: 0,
        cambio: 0,
        nombreCliente: createVentaDto.nombreCliente || 'Cliente Varios',
        documento: createVentaDto.documento || '00000000',
      });

      if (usuario) {
        nuevaVenta.usuario = usuario;
      }

      console.log('Guardando nueva venta (sin detalles aún)...', nuevaVenta);
      const ventaGuardada = await queryRunner.manager.save(nuevaVenta);
      console.log('Venta guardada:', ventaGuardada);

      let totalVenta = 0;

      if (!createVentaDto.detalles || !createVentaDto.detalles.length) {
        console.log('No se proporcionaron detalles de venta');
        throw new BadRequestException(
          'La venta debe contener al menos un detalle',
        );
      }

      for (const detalle of createVentaDto.detalles) {
        console.log('Procesando detalle:', detalle);
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.idProducto },
        });

        if (!producto) {
          console.log(`Producto con ID ${detalle.idProducto} no encontrado`);
          throw new NotFoundException(
            `Producto con ID ${detalle.idProducto} no encontrado`,
          );
        }
        console.log('Producto encontrado:', producto);

        const cantidadNum = Number(detalle.cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
          console.log(
            `Cantidad inválida para el producto ${producto.nombre}:`,
            detalle.cantidad,
          );
          throw new BadRequestException(
            `La cantidad para el producto ${producto.nombre} debe ser un número positivo`,
          );
        }

        if (producto.stock < cantidadNum) {
          console.log(
            `Stock insuficiente para el producto ${producto.nombre}. Stock actual: ${producto.stock}, solicitado: ${cantidadNum}`,
          );
          throw new BadRequestException(
            `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${cantidadNum}`,
          );
        }

        const precioUnitario = Number(producto.precioUnitario);
        const subtotal = precioUnitario * cantidadNum;

        console.log(
          `Creando detalle de venta para producto ${producto.nombre}: cantidad=${cantidadNum}, precioUnitario=${precioUnitario}, subtotal=${subtotal}`,
        );
        const nuevoDetalle = this.detalleVentaRepository.create({
          cantidad: cantidadNum,
          precioUnitario: precioUnitario,
          subtotal: subtotal,
          venta: { id: ventaGuardada.id },
          producto: { id: producto.id },
        });

        await queryRunner.manager.save(nuevoDetalle);
        console.log('Detalle de venta guardado:', nuevoDetalle);

        producto.stock -= cantidadNum;
        await queryRunner.manager.save(producto);
        console.log(
          `Stock actualizado para producto ${producto.nombre}: nuevo stock=${producto.stock}`,
        );

        totalVenta += subtotal;
        console.log(
          `Subtotal sumado al totalVenta. Total actual: ${totalVenta}`,
        );
      }

      // Calcular cambio
      const montoPagado = Number(createVentaDto.montoPagado);
      if (montoPagado < totalVenta) {
        throw new BadRequestException(
          `El monto pagado (${montoPagado}) es menor al total de la venta (${totalVenta})`,
        );
      }
      const cambio = Number((montoPagado - totalVenta).toFixed(2));

      ventaGuardada.totalVenta = totalVenta;
      ventaGuardada.montoPagado = montoPagado;
      ventaGuardada.cambio = cambio;
      await queryRunner.manager.save(ventaGuardada);
      console.log('Total de la venta, monto pagado y cambio actualizados:', {
        totalVenta,
        montoPagado,
        cambio,
      });

      await queryRunner.commitTransaction();
      console.log('Transacción confirmada. Venta creada exitosamente.');

      return this.obtenerVentaPorId(ventaGuardada.id);
    } catch (error) {
      console.log('Ocurrió un error durante la creación de la venta:', error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al procesar la venta: ' + error.message,
      );
    } finally {
      await queryRunner.release();
      console.log('QueryRunner liberado.');
    }
  }

  async anularVenta(id: number): Promise<Venta> {
    console.log(`Iniciando anulación de venta con ID: ${id}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await this.ventaRepository.findOne({
        where: { id },
        relations: ['ventadetalles', 'ventadetalles.producto'],
      });

      if (!venta) {
        console.log(`Venta con ID ${id} no encontrada para anular`);
        throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
      }

      if (venta.estado === 'anulada') {
        console.log(`La venta con ID ${id} ya está anulada`);
        throw new BadRequestException(`La venta con ID ${id} ya está anulada`);
      }

      const fechaAnulacion = new Date();

      console.log('Restaurando stock de productos de la venta...');
      for (const detalle of venta.ventadetalles) {
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.producto.id },
        });

        if (producto) {
          const cantidadNum = Number(detalle.cantidad);
          if (!isNaN(cantidadNum)) {
            producto.stock += cantidadNum;
            await queryRunner.manager.save(producto);
            console.log(
              `Stock restaurado para producto ${producto.nombre}: nuevo stock=${producto.stock}`,
            );
          } else {
            console.log(
              `Cantidad inválida en detalle de venta para producto ID ${producto.id}`,
            );
          }
        } else {
          console.log(
            `Producto con ID ${detalle.producto.id} no encontrado al restaurar stock`,
          );
        }

        // Actualizar fechaAnulacion en el detalle
        detalle.fechaAnulacion = fechaAnulacion;
        await queryRunner.manager.save(detalle);
      }

      venta.estado = 'anulada';
      venta.totalVenta = 0;
      venta.fechaAnulacion = fechaAnulacion;
      await queryRunner.manager.save(venta);
      console.log(
        'Venta marcada como anulada, totalVenta puesto en 0 y fechaAnulacion actualizada',
      );

      await queryRunner.commitTransaction();
      console.log('Transacción de anulación confirmada.');

      return venta;
    } catch (error) {
      console.log('Ocurrió un error durante la anulación de la venta:', error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al anular la venta: ' + error.message,
      );
    } finally {
      await queryRunner.release();
      console.log('QueryRunner liberado tras anulación.');
    }
  }

  async eliminarVenta(id: number): Promise<void> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['ventadetalles'],
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    await this.ventaRepository.softRemove(venta);
  }
}
