import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestResponse, AssistantOfRequest } from '@prisma/client';
import { difference, intersection, pick } from 'lodash';
import { DateTime } from 'luxon';
import { OrganizationService } from 'src/organization/organization.service';
import { AssistantOfRequestRepository } from './assistantOfRequest.repository';

interface AssignAssistantsProps {
  orgId: number;
  requestId: number;
  assistantIds: number[];
}

interface ChangeAssistantResponseProps {
  requestId: number;
  assistantId: number;
  response: RequestResponse;
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

  public async getAssignedAssistants(requestId: number) {
    return this.assistantOfRequestRepository.getMany(requestId);
  }

  public async changeAssistantResponse({
    assistantId,
    requestId,
    response,
  }: ChangeAssistantResponseProps) {
    const assistantOfRequest = await this.assistantOfRequestRepository.getOne({
      assistantId: assistantId,
      requestId,
    });

    if (assistantOfRequest === null) {
      throw new NotFoundException(
        `Assistant with id: ${assistantId} is not assigned to this request`,
      );
    }

    const updatedData = { response, createdAt: assistantOfRequest.createdAt };

    return this.assistantOfRequestRepository.updateOne({
      requestId,
      assistantId: assistantId,
      updatedData,
    });
  }
}
