import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from '@prisma/client';
import { GemelloUser } from 'src/common/types/user';
import { OrganizationService } from 'src/organization/organization.service';
import { MappedOrderCreateBody as MappedRequestCreateBody } from './models/orderRequestBody.model';
import { RequestRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatRabbitClient: ClientProxy,
    private readonly organizationService: OrganizationService,
    private readonly requestRepository: RequestRepository,
  ) {}

  public async createOrder(
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

  public async deleteRequest(orderId: number) {
    return this.requestRepository.deleteRequest(orderId);
  }

  public async getRequests(userId: number) {
    return this.requestRepository.getRequests(userId);
  }
}
