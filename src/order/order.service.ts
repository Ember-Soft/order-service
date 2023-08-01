import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GemelloUserContext } from 'src/common/decorators/gemelloUserContext.decorator';
import { EventMessagePattern } from 'src/common/rabbitmq/patterns';
import { GemelloUser } from 'src/common/types/user';
import { OrganizationFacade } from 'src/organization/organization.facade';
import { v4 as uuid } from 'uuid';
import { MappedOrderCreateBody } from './models/orderRequestBody.model';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatRabbitClient: ClientProxy,
    private readonly organizationFacade: OrganizationFacade,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async createOrder(
    { startDate, endDate, address, status }: MappedOrderCreateBody,
    user: GemelloUser,
    userContext: GemelloUserContext,
  ) {
    const { organizationId, serviceId, manager, assistants } =
      await this.organizationFacade.getOrganizationConfigForOrder(userContext);

    const orderToCreate = {
      orderId: uuid(),
      assistantId: null,
      beneficiaryId: user.userId,
      startDate: startDate.toJSDate(),
      endDate: endDate.toJSDate(),
      address,
      status,
      organizationId,
      serviceId,
    };
    const createdOrder = await this.orderRepository.createOrder(orderToCreate);

    this.chatRabbitClient.emit(EventMessagePattern.ORDER_CREATED, {
      data: { ...orderToCreate, manager, assistants },
    });

    return createdOrder;
  }

  public async deleteOrder(orderId: string) {
    return this.orderRepository.deleteOrder(orderId);
  }

  public async getOrders(userId: string) {
    return this.orderRepository.getOrders(userId);
  }
}
