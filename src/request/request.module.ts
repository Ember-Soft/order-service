import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AssistantOfRequestModule } from 'src/assistantOfRequest/assistantOfRequest.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { RequestController } from './request.controller';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';

@Module({
  imports: [
    OrganizationModule,
    AssistantOfRequestModule,
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
