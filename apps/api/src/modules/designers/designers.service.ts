import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DesignerApplicationStatus } from '@prince/shared';

@Injectable()
export class DesignersService {
  constructor(private readonly prisma: PrismaService) {}

  listApplications(status?: DesignerApplicationStatus) {
    return this.prisma.designerApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, displayAlias: true, email: true, role: true } }
      }
    });
  }

  submitApplication(userId: string, payload: CreateApplicationDto) {
    return this.prisma.designerApplication.create({
      data: {
        userId,
        status: 'pending',
        form: {
          bio: payload.bio,
          skills: payload.skills,
          rateNotes: payload.rateNotes
        },
        portfolio: {
          links: payload.portfolioLinks,
          files: payload.portfolioFiles ?? []
        }
      },
      include: {
        user: { select: { id: true, displayAlias: true, role: true } }
      }
    });
  }

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    const application = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.designerApplication.update({
        where: { id },
        data: { status },
        include: { user: true }
      });

      if (status === 'approved') {
        await tx.designerProfile.upsert({
          where: { userId: updated.userId },
          update: {
            bio: updated.form['bio'] ?? '',
            skills: updated.form['skills'] ?? [],
            portfolio: updated.portfolio
          },
          create: {
            userId: updated.userId,
            bio: updated.form['bio'] ?? '',
            skills: updated.form['skills'] ?? [],
            portfolio: updated.portfolio
          }
        });

        await tx.user.update({
          where: { id: updated.userId },
          data: { role: 'designer' }
        });

        await tx.designerBalance.upsert({
          where: { designerId: updated.userId },
          update: {},
          create: { designerId: updated.userId }
        });
      }

      return updated;
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }
}
