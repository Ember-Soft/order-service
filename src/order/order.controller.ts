import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import { DateTime } from 'luxon';
import { GemelloUserContext } from 'src/common/decorators/gemelloUserContext.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GemelloUser } from 'src/common/types/user';
import { OrderGetResponse } from './models/orderGetResponse.model';
import {
  OrderCreateBody,
  OrderPatchBody,
} from './models/orderRequestBody.model';
import { OrderService } from './order.service';

@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: OrderGetResponse,
    isArray: true,
  })
  public async getOrdersByUserId(@User() user: GemelloUser) {
    return this.orderService.getOrders(user.userId);
  }

  @ApiBody({ type: OrderCreateBody })
  @Post()
  public async createOrder(
    @Body() order: OrderCreateBody,
    @User() user: GemelloUser,
    @GemelloUserContext() userContext: GemelloUserContext,
  ): Promise<Order> {
    return this.orderService.createOrder(
      this.mapToInternalOrder(order),
      user,
      userContext,
    );
  }

  @ApiBody({ type: OrderPatchBody })
  @Patch(':id')
  public async patchOrder(
    @Param('id') orderId: string,
    @Body() partialOrder: OrderPatchBody,
  ): Promise<Order> {
    return this.orderService.patchOrder(
      orderId,
      this.mapToInternalOrder(partialOrder),
    );
  }

  @Delete(':id')
  public async deleteOrderById(@Param('id') id: string) {
    this.orderService.deleteOrder(id);
  }

  private mapToInternalOrder<
    T extends { startDate?: string; endDate?: string },
  >({ startDate, endDate, ...order }: T) {
    const mappedStartDate = startDate ? DateTime.fromISO(startDate) : undefined;
    const mappedEndDate = endDate ? DateTime.fromISO(endDate) : undefined;

    return {
      startDate: mappedStartDate,
      endDate: mappedEndDate,
      ...order,
    };
  }
}
