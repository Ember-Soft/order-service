import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Request } from '@prisma/client';

@Injectable()
export class RequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getRequestById(requestId: number) {
    return this.prisma.request.findFirst({ where: { requestId } });
  }

  public async createRequest(request: Request) {
    return this.prisma.request.create({ data: request });
  }

  public async updateRequest(requestId, updatedRequest: Partial<Request>) {
    return this.prisma.request.update({
      where: { requestId },
      data: updatedRequest,
    });
  }

  public async deleteRequest(requestId: number) {
    return this.prisma.request.delete({
      where: { requestId },
      include: { isSharedWith: true },
    });
  }

  public async getRequests(userId: number) {
    return this.prisma.request.findMany({});
  }
}
