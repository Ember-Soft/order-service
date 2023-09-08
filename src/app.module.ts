import { Module } from '@nestjs/common';
import { CoreModule } from '@ember-soft/gemello-server-core';
import { APP_GUARD } from '@nestjs/core';

import { RequestModule } from './request/request.module';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    RequestModule,
    CoreModule.forRoot({
      providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
      jwtSecret: process.env.JWT_SECRET,
    }),
  ],
})
export class AppModule {}
