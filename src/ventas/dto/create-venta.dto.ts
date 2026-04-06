import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DetalleVentaDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  idProducto: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'La cantidad debe ser un número entero válido' },
  )
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @Max(1000000, { message: 'Cantidad demasiado grande' })
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({
    description: 'ID del usuario asociado a la venta',
    example: 1,
    nullable: true,
  })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsOptional()
  idUsuario?: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    example: 'efectivo',
    enum: ['efectivo', 'tarjeta', 'transferencia', 'cotización', 'otro'],
    default: 'efectivo',
  })
  @IsString({ message: 'El método de pago debe ser una cadena de texto' })
  @IsEnum(['efectivo', 'tarjeta', 'transferencia', 'cotización', 'otro'], {
    message:
      'Método de pago inválido. Debe ser: efectivo, tarjeta, transferencia, cotización o otro',
  })
  metodoPago: string;

  @ApiProperty({
    description: 'Detalles de los productos vendidos',
    type: [DetalleVentaDto],
  })
  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];

  @ApiProperty({
    description: 'Monto pagado por el cliente',
    example: 100.0,
    type: Number,
    default: 0,
  })
  @IsNumber({}, { message: 'El monto pagado debe ser un número' })
  @Min(0, { message: 'El monto pagado no puede ser negativo' })
  montoPagado: number;

  @ApiProperty({
    description: 'Cambio entregado al cliente',
    example: 5.0,
    type: Number,
    default: 0,
  })
  @IsNumber({}, { message: 'El cambio debe ser un número' })
  @Min(0, { message: 'El cambio no puede ser negativo' })
  cambio: number;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
    maxLength: 100,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del cliente debe ser una cadena de texto' })
  nombreCliente?: string;

  @ApiProperty({
    description: 'Documento del cliente',
    example: '12345678',
    maxLength: 30,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  documento?: string;
}
