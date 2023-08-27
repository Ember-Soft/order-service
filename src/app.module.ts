import { RequestModule } from './request/request.module';
import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';

@Module({ imports: [RequestModule, CoreModule] })
export class AppModule {}
