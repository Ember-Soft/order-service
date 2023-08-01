import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import { DateTime } from 'luxon';
import { GemelloUserContext } from 'src/common/decorators/gemelloUserContext.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GemelloUser } from 'src/common/types/user';
import { OrderGetResponse } from './models/orderGetResponse.model';
import { OrderCreateBody } from './models/orderRequestBody.model';
import { OrderService } from './order.service';

@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBody({ type: OrderCreateBody })
  @Post()
  public async createOrder(
    @Body() { startDate, endDate, ...order }: OrderCreateBody,
    @User() user: GemelloUser,
    @GemelloUserContext() userContext: GemelloUserContext,
  ): Promise<Order> {
    const mappedStartDate = DateTime.fromISO(startDate);
    const mappedEndDate = DateTime.fromISO(endDate);

    return this.orderService.createOrder(
      { startDate: mappedStartDate, endDate: mappedEndDate, ...order },
      user,
      userContext,
    );
  }

  @Delete('/:id')
  public async deleteOrderById(@Param('id') id: string) {
    this.orderService.deleteOrder(id);
  }

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
}
