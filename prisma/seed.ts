import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.designerApplication.deleteMany();
  await prisma.designerProfile.deleteMany();
  await prisma.designerBalance.deleteMany();
  await prisma.payoutRequest.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      role: 'admin',
      displayAlias: 'Admin',
      email: 'admin@example.com',
      status: 'active'
    }
  });

  const buyer = await prisma.user.create({
    data: {
      role: 'buyer',
      displayAlias: 'Buyer One',
      email: 'buyer@example.com'
    }
  });

  const designer = await prisma.user.create({
    data: {
      role: 'designer',
      displayAlias: 'Alias Aurora',
      email: 'designer@example.com'
    }
  });

  const [youtube, stories, video] = await Promise.all([
    prisma.category.create({
      data: {
        name: 'YouTube',
        slug: 'youtube',
        description: 'Превью и оформление канала',
        sortOrder: 1
      }
    }),
    prisma.category.create({
      data: {
        name: 'Stories',
        slug: 'stories',
        description: 'Комплекты сторис и анимация',
        sortOrder: 2
      }
    }),
    prisma.category.create({
      data: {
        name: 'Vertical Video',
        slug: 'vertical-video',
        description: 'Монтаж Reels/TikTok',
        sortOrder: 3
      }
    })
  ]);

  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: 'Превью для YouTube',
        descriptionMd: 'Создание кликабельных превью в стилистике вашего бренда.',
        categoryId: youtube.id,
        format: '1920×1080 JPG/PSD',
        platform: 'YouTube',
        turnaround: '48 часов',
        coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        examples: [],
        baseDesignerPrice: 7000,
        platformMarkup: 1900,
        assignedDesignerId: designer.id
      }
    }),
    prisma.service.create({
      data: {
        title: 'Пакет сторис',
        descriptionMd: 'Серия из пяти сторис с анимацией и интерактивом.',
        categoryId: stories.id,
        format: '1080×1920 PSD/MP4',
        platform: 'Instagram',
        turnaround: '96 часов',
        coverUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
        examples: [],
        baseDesignerPrice: 11500,
        platformMarkup: 2400,
        assignedDesignerId: designer.id
      }
    }),
    prisma.service.create({
      data: {
        title: 'Монтаж вертикального видео',
        descriptionMd: 'Монтаж Reels/TikTok с графикой и субтитрами.',
        categoryId: video.id,
        format: '1080×1920 MP4',
        platform: 'Instagram, TikTok',
        turnaround: '72 часа',
        coverUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        examples: [],
        baseDesignerPrice: 9800,
        platformMarkup: 3100,
        assignedDesignerId: designer.id
      }
    })
  ]);

  const [thumbnailService] = services;

  const order = await prisma.order.create({
    data: {
      serviceId: thumbnailService.id,
      buyerId: buyer.id,
      designerId: designer.id,
      status: 'in_work',
      brief: {
        goal: 'Повысить CTR',
        platform: 'YouTube',
        format: '1920×1080',
        deadline: '48 часов',
        notes: 'Акцент на эмоциях спикера'
      },
      totalPrice: thumbnailService.baseDesignerPrice + thumbnailService.platformMarkup,
      chat: {
        create: {
          messages: {
            create: [
              {
                senderRole: 'buyer',
                body: 'Привет! Добавил референсы в бриф.',
                attachments: []
              },
              {
                senderRole: 'designer',
                body: 'Принял, отправлю первый вариант через 24 часа.',
                attachments: []
              }
            ]
          }
        }
      },
      payment: {
        create: {
          amountGross: thumbnailService.baseDesignerPrice + thumbnailService.platformMarkup,
          amountNet: thumbnailService.baseDesignerPrice,
          platformFee: thumbnailService.platformMarkup,
          status: 'hold',
          provider: 'mock',
          payload: {}
        }
      }
    },
    include: { payment: true }
  });

  await prisma.designerProfile.create({
    data: {
      userId: designer.id,
      bio: 'Motion дизайнер с 5-летним опытом.',
      skills: ['Motion', 'Video'],
      portfolio: { links: ['https://behance.net/sample'], files: [] },
      status: 'approved'
    }
  });

  await prisma.designerBalance.create({
    data: {
      designerId: designer.id,
      available: 0,
      pending: order.payment?.amountNet ?? 0
    }
  });

  await prisma.designerApplication.create({
    data: {
      userId: designer.id,
      status: 'approved',
      form: { bio: 'Motion дизайнер', skills: ['Motion', 'Video'] },
      portfolio: { links: ['https://behance.net/sample'], files: [] }
    }
  });

  await prisma.payoutRequest.create({
    data: {
      designerId: designer.id,
      amount: 5000,
      status: 'requested'
    }
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
