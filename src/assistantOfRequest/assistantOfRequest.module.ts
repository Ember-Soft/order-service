import { Module } from '@nestjs/common';
import { AssistantOfRequestRepository } from './assistantOfRequest.repository';
import { AssistantOfRequestService } from './assistantOfRequest.service';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [OrganizationModule],
  providers: [AssistantOfRequestRepository, AssistantOfRequestService],
  exports: [AssistantOfRequestService],
})
export class AssistantOfRequestModule {}
