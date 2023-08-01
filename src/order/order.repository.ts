import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getOrderById(orderId: string) {
    return this.prisma.order.findFirst({ where: { orderId } });
  }

  public async createOrder(order: Order) {
    return this.prisma.order.create({ data: order });
  }

  public async updateOrder(orderId, updatedOrder: Order) {
    return this.prisma.order.update({ where: { orderId }, data: updatedOrder });
  }

  public async deleteOrder(orderId: string) {
    return this.prisma.order.delete({ where: { orderId } });
  }

  public async getOrders(userId: string) {
    return this.prisma.order.findMany({ where: { beneficiaryId: userId } });
  }
}
