import { Body, Controller, Get, Param, Post, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.orders.list(status);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.orders.getById(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.orders.create(payload);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() payload: UpdateStatusDto) {
    return this.orders.updateStatus(id, payload);
  }
}
