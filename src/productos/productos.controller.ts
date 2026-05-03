import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Productos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles('Administrador')
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get('stock')
  findWithStock() {
    return this.productosService.findWithStock();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Get('categoria/:categoriaId')
  findByCategoria(@Param('categoriaId') categoriaId: string) {
    return this.productosService.findByCategoria(+categoriaId);
  }

  @Patch(':id')
  @Roles('Administrador')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Patch(':id/stock')
  @Roles('Administrador', 'Cajero')
  updateStock(
    @Param('id') id: string,
    @Body('stock') stock: number,
  ) {
    if (stock === undefined || stock === null) {
      throw new ForbiddenException('El stock debe estar definido');
    }
    return this.productosService.update(+id, { stock });
  }

  @Delete(':id')
  @Roles('Administrador')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
