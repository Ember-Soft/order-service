import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AssignAssistantsData {
  @IsArray()
  @ApiProperty({ isArray: true, example: [1] })
  assistantIds: number[];
}
