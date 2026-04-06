import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.usuariosRepository.findOne({
      where: { nombreUsuario: createUsuarioDto.nombreUsuario.trim() },
    });
    if (existe) {
      throw new ConflictException('El usuario ya existe');
    }

    const clave =
      createUsuarioDto.clave && createUsuarioDto.clave.trim() !== ''
        ? createUsuarioDto.clave
        : process.env.DEFAULT_PASSWORD;

    const usuario = this.usuariosRepository.create({
      nombreUsuario: createUsuarioDto.nombreUsuario.trim(),
      email: createUsuarioDto.email.trim(),
      clave,
      idRol: createUsuarioDto.idRol,
      idEmpleado: createUsuarioDto.idEmpleado,
    });

    const usuarioBd = await this.usuariosRepository.save(usuario);
    delete usuarioBd.clave;
    return usuarioBd;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: ['rol', 'empleado'],
      select: [
        'id',
        'idEmpleado',
        'idRol',
        'nombreUsuario',
        'email',
        'fechaCreacion',
        'fechaModificacion',
        'fechaEliminacion',
      ],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol', 'empleado'],
      select: [
        'id',
        'idEmpleado',
        'idRol',
        'nombreUsuario',
        'email',
        'fechaCreacion',
        'fechaModificacion',
        'fechaEliminacion',
      ],
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario ${id} no existe`);
    }
    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol', 'empleado'],
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario ${id} no existe`);
    }

    if (
      updateUsuarioDto.nombreUsuario &&
      updateUsuarioDto.nombreUsuario.trim() !== usuario.nombreUsuario
    ) {
      const existe = await this.usuariosRepository.findOne({
        where: { nombreUsuario: updateUsuarioDto.nombreUsuario.trim() },
      });
      if (existe) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
      usuario.nombreUsuario = updateUsuarioDto.nombreUsuario.trim();
    }

    if (updateUsuarioDto.email) {
      usuario.email = updateUsuarioDto.email.trim();
    }

    if (updateUsuarioDto.clave) {
      usuario.clave = updateUsuarioDto.clave;
    }

    if (updateUsuarioDto.idRol) {
      usuario.idRol = updateUsuarioDto.idRol;
      // Actualiza la relación con el rol
      usuario.rol = { id: updateUsuarioDto.idRol } as any;
    }

    if (updateUsuarioDto.idEmpleado) {
      usuario.idEmpleado = updateUsuarioDto.idEmpleado;
      // Actualiza la relación con el empleado
      usuario.empleado = { id: updateUsuarioDto.idEmpleado } as any;
    }

    Object.assign(usuario, updateUsuarioDto);

    const usuarioActualizado = await this.usuariosRepository.save(usuario);
    delete usuarioActualizado.clave;
    return usuarioActualizado;
  }

  async remove(id: number) {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario ${id} no existe`);
    }
    await this.usuariosRepository.softRemove(usuario);
    return {
      message: 'Usuario eliminado exitosamente',
      usuario,
    };
  }

  async validate(nombreUsuario: string, clave: string): Promise<Usuario> {
    const usuarioOk = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.clave')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.nombreUsuario = :nombreUsuario', { nombreUsuario })
      .getOne();

    if (!usuarioOk) throw new NotFoundException('Usuario inexistente');

    if (!(await usuarioOk.validatePassword(clave))) {
      throw new UnauthorizedException('Clave incorrecta');
    }

    delete usuarioOk.clave;
    return usuarioOk;
  }
}
