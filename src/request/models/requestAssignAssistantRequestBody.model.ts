import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class RequestAssignAssistantBody {
  @IsArray()
  @IsNumber()
  @ApiProperty({ isArray: true })
  assistantIds: number[];
}
