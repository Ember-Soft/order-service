import { Injectable } from '@nestjs/common';
import { AssistantOfRequest } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AssistantOfRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(data: AssistantOfRequest[]) {
    return this.prisma.assistantOfRequest.createMany({ data });
  }

  public async getMany(requestId: number) {
    return this.prisma.assistantOfRequest.findMany({ where: { requestId } });
  }
}
