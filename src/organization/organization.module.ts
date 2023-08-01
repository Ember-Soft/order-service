import { Module } from '@nestjs/common';
import { OrganizationFacade } from './organization.facade';

@Module({ providers: [OrganizationFacade], exports: [OrganizationFacade] })
export class OrganizationModule {}
