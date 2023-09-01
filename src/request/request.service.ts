import { AssistantOfRequestService } from './../assistantOfRequest/assistantOfRequest.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from '@prisma/client';
import { GemelloUser } from 'src/common/types/user';
import { OrganizationService } from 'src/organization/organization.service';
import { MappedRequestCreateBody as MappedRequestCreateBody } from './models/createRequestData.model';
import { RequestRepository } from './request.repository';
import { difference } from 'lodash';
import { PatchRequestData } from './models/patchRequestData.model';

@Injectable()
export class RequestService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatRabbitClient: ClientProxy,
    private readonly organizationService: OrganizationService,
    private readonly requestRepository: RequestRepository,
    private readonly assistantOfRequestService: AssistantOfRequestService,
  ) {}

  public async createRequest(
    { termFrom, termTo, orgId, ...request }: MappedRequestCreateBody,
    user: GemelloUser,
  ) {
    const { managers, isBeneficiary } =
      await this.organizationService.getOrganizationConfig(orgId, user.userId);

    if (!isBeneficiary) {
      throw new ForbiddenException('Only beneficiary can create a request');
    }

    return await this.requestRepository.createRequest({
      ...request,
      termFrom: termFrom.toJSDate(),
      termTo: termTo.toJSDate(),
      managerId: managers[0].memberId,
      orgId,
      beneficiaryId: user.userId,
    } as Request);
  }

  public async deleteRequest(requestId: number) {
    return this.requestRepository.deleteRequest(requestId);
  }

  public async getRequests(userId: number) {
    return this.requestRepository.getRequests(userId);
  }

  public async assignAssistants(id: number, assistantIds: number[]) {
    const { orgId } = await this.requestRepository.getRequestById(id);

    return this.assistantOfRequestService.assignAssistants({
      orgId,
      requestId: id,
      assistantIds,
    });
  }

  public async getAssignedAssistants(requestId: number) {
    return this.assistantOfRequestService.getAssignedAssistants(requestId);
  }

  public async patchRequest(requestId: number, patchData: PatchRequestData) {
    return this.requestRepository.updateRequest(requestId, patchData);
  }
}
