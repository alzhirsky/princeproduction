import { Injectable } from '@nestjs/common';
import { mockDesignerApplications } from '../../common/mock-data';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class DesignersService {
  listApplications() {
    return mockDesignerApplications;
  }

  submitApplication(userId: string, payload: CreateApplicationDto) {
    const application = {
      id: `app-${Date.now()}`,
      userId,
      status: 'pending',
      ...payload,
      submittedAt: new Date().toISOString()
    };
    mockDesignerApplications.push(application as any);
    return application;
  }

  updateStatus(id: string, status: 'approved' | 'rejected') {
    return { id, status };
  }
}
