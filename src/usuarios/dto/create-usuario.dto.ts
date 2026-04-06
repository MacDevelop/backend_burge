import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'El campo idEmpleado no debe ser vacío' })
  readonly idEmpleado: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'El campo idRol no debe ser vacío' })
  readonly idRol: number;

  @ApiProperty({
    example: 'marlene',
  })
  @IsNotEmpty({ message: 'El campo usario no debe ser vacío' })
  @IsString({ message: 'El campo usario debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo usario no debe ser mayor a 12 caracteres',
  })
  @MinLength(2, { message: 'El campo usario no debe ser menor a 4 caracteres' })
  readonly nombreUsuario: string;

  @ApiProperty({
    example: 'marlene@gmail.com',
  })
  @IsNotEmpty({ message: 'El campo email no debe ser vacío' })
  @IsEmail({}, { message: 'El campo email debe ser un correo válido' })
  @MaxLength(100, {
    message: 'El campo email no debe ser mayor a 100 caracteres',
  })
  @MinLength(5, { message: 'El campo email no debe ser menor a 5 caracteres' })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    required: false,
    description:
      'Contraseña del usuario. Si no se proporciona, se usará el valor por defecto del .env (DEFAULT_PASSWORD)',
  })
  @IsString({ message: 'El campo clave debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo clave no debe ser mayor a 100 caracteres',
  })
  @MinLength(6, { message: 'El campo clave no debe ser menor a 6 caracteres' })
  readonly clave?: string;
}
