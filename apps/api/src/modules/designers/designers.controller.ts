import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DesignersService } from './designers.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('designer-applications')
export class DesignersController {
  constructor(private readonly designers: DesignersService) {}

  @Get()
  listApplications() {
    return this.designers.listApplications();
  }

  @Post()
  create(@Body() payload: CreateApplicationDto) {
    return this.designers.submitApplication('designer-temp', payload);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.designers.updateStatus(id, 'approved');
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.designers.updateStatus(id, 'rejected');
  }
}
