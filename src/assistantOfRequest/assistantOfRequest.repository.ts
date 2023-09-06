import { Injectable } from '@nestjs/common';
import { AssistantOfRequest } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

interface GetOneProps {
  requestId: number;
  assistantId: number;
}

interface UpdateOneProps extends GetOneProps {
  updatedData: Omit<AssistantOfRequest, 'requestId' | 'memberId'>;
}

@Injectable()
export class AssistantOfRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(data: AssistantOfRequest[]) {
    return this.prisma.assistantOfRequest.createMany({ data });
  }

  public async getMany(requestId: number) {
    return this.prisma.assistantOfRequest.findMany({ where: { requestId } });
  }

  public async getOne({ assistantId, requestId }: GetOneProps) {
    return this.prisma.assistantOfRequest.findUnique({
      where: { requestId_memberId: { requestId, memberId: assistantId } },
    });
  }

  public async updateOne({
    requestId,
    assistantId,
    updatedData,
  }: UpdateOneProps) {
    return this.prisma.assistantOfRequest.update({
      data: updatedData,
      where: { requestId_memberId: { requestId, memberId: assistantId } },
    });
  }
}
