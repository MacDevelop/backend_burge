import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de todas las ventas' })
  async obtenerVentas() {
    return this.ventasService.obtenerVentas();
  }

  @Get('reportes')
  @ApiResponse({ status: 200, description: 'Reporte de ventas diario y mensual' })
  async obtenerReportes() {
    return this.ventasService.generarReportes();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Detalle de una venta específica' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  async obtenerVentaPorId(@Param('id') id: number): Promise<Venta> {
    return this.ventasService.obtenerVentaPorId(id);
  }
}
