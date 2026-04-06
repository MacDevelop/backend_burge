import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Hamburguesas' })
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo nombre no debe tener más de 50 caracteres',
  })
  @MinLength(2, { message: 'El campo nombre debe tener al menos 2 caracteres' })
  readonly nombre: string;

  @ApiProperty({ example: 'Deliciosas hamburguesas de carne' })
  @IsNotEmpty({ message: 'El campo descripcion no debe ser vacío' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(255, {
    message: 'El campo descripcion no debe tener más de 255 caracteres',
  })
  readonly descripcion: string;
}
