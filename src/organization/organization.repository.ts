import { PrismaService } from '@ember-soft/gemello-server-core';
import { Injectable } from '@nestjs/common';
import { MemberOfOrganization, MemberRole } from '@prisma/client';

interface OrgMembersByQuery {
  role?: MemberRole;
}

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrganizationMembersBy(
    orgId: number,
    query: OrgMembersByQuery = {},
  ): Promise<MemberOfOrganization[]> {
    return await this.prisma.memberOfOrganization.findMany({
      where: { orgId, ...query },
    });
  }

  public async getOrganizationManagers(orgId: number) {
    return this.getOrganizationMembersBy(orgId, { role: MemberRole.MANAGER });
  }

  public async getOrganizationAssistants(orgId: number) {
    return this.getOrganizationMembersBy(orgId, {
      role: MemberRole.ASSISTANT,
    });
  }

  public async getOrganizationBeneficiaries(orgId: number) {
    return this.getOrganizationMembersBy(orgId, {
      role: MemberRole.BENEFICIARY,
    });
  }

  public async getOrganizationMembers(orgId: number) {
    return this.getOrganizationMembersBy(orgId);
  }
}
