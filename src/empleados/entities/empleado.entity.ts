import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 20,
    unique: true,
    nullable: false,
    name: 'cedula_identidad',
  })
  cedulaIdentidad: string;

  @Column('varchar', { length: 50, nullable: false })
  nombre: string;

  @Column('varchar', { length: 50, nullable: false, name: 'apellido_paterno' })
  apellidoPaterno: string;

  @Column('varchar', { length: 50, nullable: false, name: 'apellido_materno' })
  apellidoMaterno: string;

  @Column({ type: 'date', nullable: false, name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @Column('varchar', { length: 120, nullable: false })
  direccion: string;

  @Column('varchar', { length: 50, nullable: false })
  celular: string;

  @Column('varchar', { length: 100, nullable: false })
  email: string;

  @Column('varchar', { length: 30, nullable: false })
  cargo: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Usuario, (usuario) => usuario.empleado)
  usuarios: Usuario[];
}
