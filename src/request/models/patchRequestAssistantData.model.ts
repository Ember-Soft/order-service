import { ApiProperty } from '@nestjs/swagger';
import { RequestResponse } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class PatchRequestAssistantData {
  @ApiProperty({ enum: RequestResponse })
  @IsEnum(RequestResponse)
  response: RequestResponse;
}
