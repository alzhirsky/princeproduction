import { Body, Controller, Get, Param, Post, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Query() query: ListOrdersDto) {
    return this.orders.list(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.orders.getById(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.orders.create(payload);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() payload: CreateMessageDto) {
    return this.orders.addMessage(id, payload);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() payload: UpdateStatusDto) {
    return this.orders.updateStatus(id, payload);
  }
}
