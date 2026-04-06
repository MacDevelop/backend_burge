import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'administrador',
    description: 'Nombre del rol dentro de la hamburguesería',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({
    example:
      'Rol encargado de administrar a los usuarios y gestionar ventas en la hamburguesería',
    description: 'Descripción del rol dentro de la hamburguesería',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
