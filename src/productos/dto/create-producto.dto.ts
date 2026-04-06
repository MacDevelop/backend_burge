import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Hamburguesa Clásica',
  })
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo nombre no debe superar los 50 caracteres',
  })
  @MinLength(2, { message: 'El campo nombre debe tener al menos 2 caracteres' })
  readonly nombre: string;

  @ApiProperty({
    example: 'Hamburguesa Clásica, jugosa y con queso cheddar.',
  })
  @IsNotEmpty({ message: 'El campo descripcion no debe ser vacío' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(200, {
    message: 'El campo descripcion no debe superar los 200 caracteres',
  })
  @MinLength(10, {
    message: 'El campo descripcion debe tener al menos 10 caracteres',
  })
  readonly descripcion: string;

  @ApiProperty({
    example: 499.99,
    description: 'Precio unitario de la hamburguesa, puede tener decimales',
    type: 'number',
    format: 'decimal',
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    {
      message:
        'El campo precioUnitario debe ser numérico y puede tener hasta 2 decimales',
    },
  )
  readonly precioUnitario: number;

  @ApiProperty({
    example: 30,
  })
  @IsNumber({}, { message: 'El campo stock debe ser de tipo numérico' })
  readonly stock: number;

  @ApiProperty({
    example: 'https://mi-sitio.com/imagenes/hamburguesa_clasica.jpg',
    description: 'URL de la imagen de la hamburguesa',
  })
  @IsString({ message: 'El campo urlImagen debe ser de tipo cadena' })
  readonly urlImagen: string;

  @ApiProperty({
    example: 2,
    description:
      'ID de la categoría de la hamburguesa (por ejemplo: 1=Hamburguesas, 2=Complementos, 3=Bebidas, etc.)',
  })
  @IsDefined({ message: 'El campo idCategoria debe estar definido' })
  @IsNumber({}, { message: 'El campo idCategoria debe ser de tipo numérico' })
  readonly idCategoria: number;
}
