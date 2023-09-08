import { Module } from '@nestjs/common';
import { OrganizationModule } from 'src/organization/organization.module';

import { AssistantOfRequestRepository } from './assistantOfRequest.repository';
import { AssistantOfRequestService } from './assistantOfRequest.service';

@Module({
  imports: [OrganizationModule],
  providers: [AssistantOfRequestRepository, AssistantOfRequestService],
  exports: [AssistantOfRequestService],
})
export class AssistantOfRequestModule {}
