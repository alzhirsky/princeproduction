import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

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

  const category = await prisma.category.create({
    data: {
      name: 'YouTube',
      slug: 'youtube',
      description: 'Превью и оформление канала'
    }
  });

  const service = await prisma.service.create({
    data: {
      title: 'Превью для YouTube',
      descriptionMd: 'Создание кликабельных превью в стилистике вашего бренда.',
      categoryId: category.id,
      examples: [],
      baseDesignerPrice: 7000,
      platformMarkup: 1900
    }
  });

  await prisma.order.create({
    data: {
      serviceId: service.id,
      buyerId: buyer.id,
      designerId: designer.id,
      status: 'in_work',
      brief: {
        goal: 'Повысить CTR',
        platform: 'YouTube',
        format: '1920×1080',
        deadline: '48 часов'
      },
      totalPrice: 8900
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
