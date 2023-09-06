import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, RequestResponse } from '@prisma/client';
import { GemelloUser } from 'src/common/types/user';
import { OrganizationService } from 'src/organization/organization.service';
import { AssistantOfRequestService } from './../assistantOfRequest/assistantOfRequest.service';
import { MappedRequestCreateBody } from './models/createRequestData.model';
import { PatchRequestData } from './models/patchRequestData.model';
import { RequestRepository } from './request.repository';

interface PatchAssistantResponseProps {
  requestId: number;
  userId: number;
  response: RequestResponse;
}

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
    await this.checkIfRequestExists(requestId);
    return this.requestRepository.deleteRequest(requestId);
  }

  public async getRequests(userId: number) {
    return this.requestRepository.getRequests(userId);
  }

  public async assignAssistants(requestId: number, assistantIds: number[]) {
    await this.checkIfRequestExists(requestId);
    const { orgId } = await this.requestRepository.getRequestById(requestId);

    return this.assistantOfRequestService.assignAssistants({
      orgId,
      requestId: requestId,
      assistantIds,
    });
  }

  public async getAssignedAssistants(requestId: number) {
    return this.assistantOfRequestService.getAssignedAssistants(requestId);
  }

  public async patchRequest(requestId: number, patchData: PatchRequestData) {
    await this.checkIfRequestExists(requestId);
    await this.requestRepository.updateRequest(requestId, patchData);
  }

  public async patchAssignedAssistantResponse({
    userId,
    requestId,
    response,
  }: PatchAssistantResponseProps) {
    await this.checkIfRequestExists(requestId);
    return this.assistantOfRequestService.changeAssistantResponse({
      assistantId: userId,
      requestId,
      response,
    });
  }

  private async checkIfRequestExists(requestId: number) {
    const request = await this.requestRepository.getRequestById(requestId);
    if (!request) {
      throw new NotFoundException(`Cannot find request with id: ${requestId}`);
    }

    return request;
  }
}
