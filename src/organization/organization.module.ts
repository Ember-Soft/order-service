import { Module } from '@nestjs/common';
import { OrganizationFacade } from './organization.facade';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationFacade, OrganizationRepository, OrganizationService],
  exports: [OrganizationFacade, OrganizationService],
})
export class OrganizationModule {}
