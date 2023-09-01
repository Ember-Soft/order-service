import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { groupBy } from 'lodash';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}
  public async getOrganizationManagers(orgId: number) {
    return this.organizationRepository.getOrganizationManagers(orgId);
  }

  public async getOrganizationAssistants(orgId: number) {
    return this.organizationRepository.getOrganizationAssistants(orgId);
  }

  public async getOrganizationBeneficiaries(orgId: number) {
    return this.organizationRepository.getOrganizationBeneficiaries(orgId);
  }

  public async getOrganizationConfig(orgId: number, userId: number) {
    const members = await this.organizationRepository.getOrganizationMembers(
      orgId,
    );

    const { MANAGER: managers = [], BENEFICIARY: beneficiares = [] } = groupBy(
      members,
      'role',
    );

    const isBeneficiary =
      beneficiares.find(({ memberId }) => memberId === userId) !== undefined;

    return { managers, isBeneficiary };
  }
}
