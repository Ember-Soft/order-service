import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { User } from 'src/common/decorators/user.decorator';
import { GemelloUser } from 'src/common/types/user';
import { RequestGetResponse } from './models/requestGetResponse.model';
import { RequestCreateBody } from './models/requestRequestBody.model';
import { RequestService } from './request.service';
import { Request } from '@prisma/client';

@ApiBearerAuth()
@Controller('order')
export class RequestController {
  constructor(private readonly orderService: RequestService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: RequestGetResponse,
    isArray: true,
  })
  public async getRequestsByUserId(@User() user: GemelloUser) {
    return this.orderService.getRequests(user.userId);
  }

  @ApiBody({ type: RequestCreateBody })
  @Post()
  public async createOrder(
    @Body() order: RequestCreateBody,
    @User() user: GemelloUser,
  ): Promise<Request> {
    return this.orderService.createRequest(
      this.mapToInternalOrder(order),
      user,
    );
  }

  @Delete(':id')
  public async deleteOrderById(@Param('id') id: number) {
    this.orderService.deleteRequest(id);
  }

  private mapToInternalOrder<T extends { termFrom?: string; termTo?: string }>({
    termFrom,
    termTo,
    ...order
  }: T) {
    const mappedStartDate = termFrom ? DateTime.fromISO(termFrom) : undefined;
    const mappedEndDate = termFrom ? DateTime.fromISO(termTo) : undefined;

    return {
      termFrom: mappedStartDate,
      termTo: mappedEndDate,
      ...order,
    };
  }
}
