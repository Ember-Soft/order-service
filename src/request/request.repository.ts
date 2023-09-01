import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Request } from '@prisma/client';
import { UseRepositoryError } from 'src/common/decorators/useRepositoryError.decorator';

@Injectable()
export class RequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  @UseRepositoryError()
  public async getRequestById(requestId: number) {
    return this.prisma.request.findFirst({ where: { requestId } });
  }

  @UseRepositoryError()
  public async createRequest(request: Request) {
    return this.prisma.request.create({ data: request });
  }

  @UseRepositoryError()
  public async updateRequest(requestId, updatedRequest: Partial<Request>) {
    return this.prisma.request.update({
      where: { requestId },
      data: updatedRequest,
    });
  }

  @UseRepositoryError()
  public async deleteRequest(requestId: number) {
    return this.prisma.request.delete({
      where: { requestId },
      include: { isSharedWith: true },
    });
  }

  @UseRepositoryError()
  public async getRequests(userId: number) {
    return this.prisma.request.findMany({});
  }
}
