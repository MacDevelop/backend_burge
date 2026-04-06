import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'La cédula de identidad no debe estar vacía' })
  @IsString({ message: 'La cédula de identidad debe ser una cadena' })
  @MaxLength(20, {
    message: 'La cédula de identidad no debe ser mayor a 20 caracteres',
  })
  readonly cedulaIdentidad: string;

  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena' })
  @MaxLength(50, { message: 'El nombre no debe ser mayor a 50 caracteres' })
  readonly nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido paterno no debe estar vacío' })
  @IsString({ message: 'El apellido paterno debe ser una cadena' })
  @MaxLength(50, {
    message: 'El apellido paterno no debe ser mayor a 50 caracteres',
  })
  readonly apellidoPaterno: string;

  @ApiProperty({ example: 'Gómez' })
  @IsNotEmpty({ message: 'El apellido materno no debe estar vacío' })
  @IsString({ message: 'El apellido materno debe ser una cadena' })
  @MaxLength(50, {
    message: 'El apellido materno no debe ser mayor a 50 caracteres',
  })
  readonly apellidoMaterno: string;

  @ApiProperty({
    example: '1990-05-23',
    description: 'Fecha en formato ISO (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de nacimiento no debe estar vacía' })
  @IsDateString(
    {},
    {
      message:
        'La fecha de nacimiento debe ser una fecha válida en formato ISO',
    },
  )
  readonly fechaNacimiento: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123' })
  @IsNotEmpty({ message: 'La dirección no debe estar vacía' })
  @IsString({ message: 'La dirección debe ser una cadena' })
  @MaxLength(120, {
    message: 'La dirección no debe ser mayor a 120 caracteres',
  })
  readonly direccion: string;

  @ApiProperty({ example: '5551234567' })
  @IsNotEmpty({ message: 'El celular no debe estar vacío' })
  @IsString({ message: 'El celular debe ser una cadena' })
  @MaxLength(50, { message: 'El celular no debe ser mayor a 50 caracteres' })
  readonly celular: string;

  @ApiProperty({ example: 'juanperez@gmail.com' })
  @IsNotEmpty({ message: 'El email no debe estar vacío' })
  @IsString({ message: 'El email debe ser una cadena' })
  @MaxLength(100, { message: 'El email no debe ser mayor a 100 caracteres' })
  readonly email: string;

  @ApiProperty({ example: 'Cajero' })
  @IsNotEmpty({ message: 'El cargo no debe estar vacío' })
  @IsString({ message: 'El cargo debe ser una cadena' })
  @MaxLength(30, { message: 'El cargo no debe ser mayor a 30 caracteres' })
  readonly cargo: string;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: 'El estado activo no debe estar vacío' })
  readonly activo: boolean;
}
