import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private empleadosRepository: Repository<Empleado>,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const empleado = this.empleadosRepository.create({
      cedulaIdentidad: createEmpleadoDto.cedulaIdentidad,
      nombre: createEmpleadoDto.nombre,
      apellidoPaterno: createEmpleadoDto.apellidoPaterno,
      apellidoMaterno: createEmpleadoDto.apellidoMaterno,
      fechaNacimiento: new Date(createEmpleadoDto.fechaNacimiento),
      direccion: createEmpleadoDto.direccion,
      celular: createEmpleadoDto.celular,
      email: createEmpleadoDto.email,
      cargo: createEmpleadoDto.cargo,
      activo: createEmpleadoDto.activo,
    });

    const empleadoBd = await this.empleadosRepository.save(empleado);
    return empleadoBd;
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.find({
      select: [
        'id',
        'cedulaIdentidad',
        'nombre',
        'apellidoPaterno',
        'apellidoMaterno',
        'fechaNacimiento',
        'direccion',
        'celular',
        'email',
        'cargo',
        'activo',
        'fechaCreacion',
        'fechaModificacion',
        'fechaEliminacion',
      ],
    });
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOne({
      where: { id },
      select: [
        'id',
        'cedulaIdentidad',
        'nombre',
        'apellidoPaterno',
        'apellidoMaterno',
        'fechaNacimiento',
        'direccion',
        'celular',
        'email',
        'cargo',
        'activo',
        'fechaCreacion',
        'fechaModificacion',
        'fechaEliminacion',
      ],
    });
    if (!empleado) throw new NotFoundException(`El empleado ${id} no existe`);
    return empleado;
  }

  async update(
    id: number,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOneBy({ id });
    if (!empleado) throw new NotFoundException(`El empleado ${id} no existe`);

    if (updateEmpleadoDto.cedulaIdentidad)
      empleado.cedulaIdentidad = updateEmpleadoDto.cedulaIdentidad;
    if (updateEmpleadoDto.nombre) empleado.nombre = updateEmpleadoDto.nombre;
    if (updateEmpleadoDto.apellidoPaterno)
      empleado.apellidoPaterno = updateEmpleadoDto.apellidoPaterno;
    if (updateEmpleadoDto.apellidoMaterno)
      empleado.apellidoMaterno = updateEmpleadoDto.apellidoMaterno;
    if (updateEmpleadoDto.fechaNacimiento)
      empleado.fechaNacimiento = new Date(
        updateEmpleadoDto.fechaNacimiento as any,
      );
    if (updateEmpleadoDto.direccion)
      empleado.direccion = updateEmpleadoDto.direccion;
    if (updateEmpleadoDto.celular) empleado.celular = updateEmpleadoDto.celular;
    if (updateEmpleadoDto.email) empleado.email = updateEmpleadoDto.email;
    if (updateEmpleadoDto.cargo) empleado.cargo = updateEmpleadoDto.cargo;
    if (updateEmpleadoDto.activo !== undefined)
      empleado.activo = updateEmpleadoDto.activo;

    const empleadoActualizado = await this.empleadosRepository.save(empleado);
    return empleadoActualizado;
  }

  async remove(id: number) {
    const empleado = await this.empleadosRepository.findOneBy({ id });
    if (!empleado) throw new NotFoundException(`El empleado ${id} no existe`);
    await this.empleadosRepository.softRemove(empleado);
    return { message: 'Empleado eliminado exitosamente', empleado };
  }
}
