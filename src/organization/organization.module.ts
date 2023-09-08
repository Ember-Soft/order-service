import { Module } from '@nestjs/common';

import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationRepository, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
