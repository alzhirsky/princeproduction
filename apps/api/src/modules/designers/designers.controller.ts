import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DesignersService } from './designers.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { DesignerApplicationStatus } from '@prince/shared';

@Controller('designer-applications')
export class DesignersController {
  constructor(private readonly designers: DesignersService) {}

  @Get()
  listApplications(@Query('status') status?: DesignerApplicationStatus) {
    return this.designers.listApplications(status);
  }

  @Post()
  create(@Body() payload: SubmitApplicationDto) {
    const { userId, ...application } = payload;
    return this.designers.submitApplication(userId, application);
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
