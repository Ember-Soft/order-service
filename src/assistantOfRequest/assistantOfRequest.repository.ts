import { Injectable } from '@nestjs/common';
import { MemberOfRequest } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AssistantOfRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(data: MemberOfRequest[]) {
    return this.prisma.memberOfRequest.createMany({ data });
  }

  public async getMany(requestId: number) {
    return this.prisma.memberOfRequest.findMany({ where: { requestId } });
  }
}
