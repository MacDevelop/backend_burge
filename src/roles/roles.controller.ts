import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Roles')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(id);
  }
}
