import { OrderModule } from './order/order.module';
import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';

@Module({ imports: [OrderModule, CoreModule] })
export class AppModule {}
