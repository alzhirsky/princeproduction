import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DesignersModule } from './modules/designers/designers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ChatModule } from './modules/chat/chat.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CatalogModule,
    OrdersModule,
    DesignersModule,
    PaymentsModule,
    ChatModule,
    AdminModule
  ]
})
export class AppModule {}
