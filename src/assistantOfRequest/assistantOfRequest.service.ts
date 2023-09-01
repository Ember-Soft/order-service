import { ConflictException, Injectable } from '@nestjs/common';
import { RequestResponse } from '@prisma/client';
import { difference, intersection } from 'lodash';
import { DateTime } from 'luxon';
import { OrganizationService } from 'src/organization/organization.service';
import { AssistantOfRequestRepository } from './assistantOfRequest.repository';

interface AssignAssistantsProps {
  orgId: number;
  requestId: number;
  assistantIds: number[];
}

@Injectable()
export class AssistantOfRequestService {
  constructor(
    private readonly assistantOfRequestRepository: AssistantOfRequestRepository,
    private readonly organizationService: OrganizationService,
  ) {}

  public async assignAssistants({
    orgId,
    assistantIds,
    requestId,
  }: AssignAssistantsProps) {
    const assistants = await this.organizationService.getOrganizationAssistants(
      orgId,
    );

    const organizationAssistantIds = assistants.map(({ memberId }) => memberId);
    const organizationAssistantsDiff = difference(
      assistantIds,
      organizationAssistantIds,
    );

    if (organizationAssistantsDiff.length !== 0) {
      throw new ConflictException(
        `Members with ids: ${organizationAssistantsDiff.join()} are not assistants within this organization`,
      );
    }

    const assignedAssistants = await this.assistantOfRequestRepository.getMany(
      requestId,
    );

    const assignedAssistantIds = assignedAssistants.map(
      ({ memberId }) => memberId,
    );

    const alreadyAssignedAssistantIds = intersection(
      assistantIds,
      assignedAssistantIds,
    );

    if (alreadyAssignedAssistantIds.length !== 0) {
      throw new ConflictException(
        `Assistants with ids: ${alreadyAssignedAssistantIds.join()} are already assigned to this request`,
      );
    }

    const assistantsOfRequest = assistantIds.map((memberId) => ({
      memberId,
      requestId,
      response: RequestResponse.PENDING,
      createdAt: DateTime.now().toJSDate(),
    }));

    return this.assistantOfRequestRepository.createMany(assistantsOfRequest);
  }
}
