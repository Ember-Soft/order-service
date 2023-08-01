import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createOrder(order: Order) {
    return this.prisma.order.create({ data: order });
  }

  public async deleteOrder(orderId: string) {
    return this.prisma.order.delete({ where: { orderId } });
  }

  public async getOrders(userId: string) {
    return this.prisma.order.findMany({ where: { beneficiaryId: userId } });
  }
}
