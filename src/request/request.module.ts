import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestRepository } from './request.repository';
import { OrganizationModule } from 'src/organization/organization.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    OrganizationModule,
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'default',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
})
export class RequestModule {}
