import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get()
  listServices() {
    return this.catalog.listServices();
  }

  @Post()
  createService(@Body() payload: CreateServiceDto) {
    return this.catalog.createService(payload);
  }

  @Patch(':id')
  updateService(@Param('id') id: string, @Body() payload: UpdateServiceDto) {
    return this.catalog.updateService(id, payload);
  }
}
