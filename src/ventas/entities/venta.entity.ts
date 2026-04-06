import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle_venta.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_venta', type: 'numeric', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  totalVenta: number;

  @Column({
    name: 'metodo_pago',
    type: 'varchar',
    length: 50,
    default: 'efectivo',
    enum: ['efectivo', 'tarjeta', 'transferencia', 'cotización', 'otro'],
  })
  metodoPago: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'realizada',
    comment: 'Estado de la venta: realizada o anulada',
  })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @Column({ name: 'fecha_anulacion', type: 'timestamp', nullable: true })
  fechaAnulacion: Date | null;

  @Column({
    name: 'monto_pagado',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Transform(({ value }) => parseFloat(value))
  montoPagado: number;

  @Column({
    name: 'cambio',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Transform(({ value }) => parseFloat(value))
  cambio: number;

  @Column({
    name: 'nombre_cliente',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombreCliente?: string;

  @Column({ name: 'documento', type: 'varchar', length: 30, nullable: true })
  documento?: string;

  //  muchas ventas puede realizar  un usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta, {
    cascade: true,
  })
  ventadetalles: DetalleVenta[];
}
