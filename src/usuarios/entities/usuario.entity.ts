import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'id_rol' })
  idRol: number;

  @Column({ nullable: true, name: 'id_empleado' })
  idEmpleado: number;

  @Column('varchar', { length: 50, nullable: false, name: 'nombre_usuario' })
  nombreUsuario: string;

  @Column('varchar', { length: 100, nullable: false })
  email: string;

  @Column('varchar', { length: 5000, nullable: true, select: false })
  clave: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Role, (role) => role.usuarios)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  rol: Role;

  @ManyToOne(() => Empleado, (empleado) => empleado.usuarios)
  @JoinColumn({ name: 'id_empleado', referencedColumnName: 'id' })
  empleado: Empleado;

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.clave) {
      const salt = await bcrypt.genSalt();
      this.clave = await bcrypt.hash(this.clave, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.clave);
  }
}
