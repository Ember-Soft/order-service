import { ApiProperty } from '@nestjs/swagger';
import { HelpType, RequestResponse } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetRequestData {
  @ApiProperty({ example: 1 })
  @IsNumber()
  requestId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  orgId: number;

  @ApiProperty({ example: RequestResponse.PENDING, enum: RequestResponse })
  @IsEnum({ enum: RequestResponse })
  response: RequestResponse;

  @ApiProperty({ example: HelpType.TRANSPORT, enum: HelpType })
  @IsEnum({ enum: HelpType })
  typeOfHelp: HelpType;

  @ApiProperty({ example: '2023-07-29T13:48:30Z' })
  @IsDateString()
  termFrom: string;

  @ApiProperty({ example: '2023-07-29T13:48:30Z' })
  @IsDateString()
  termTo: string;

  @ApiProperty({ example: 'ul. Grumwaldzka 11, 51-222 Wrocław' })
  @IsString()
  addressFrom: string;

  @ApiProperty({ example: 'ul. Grumwaldzka 11, 51-222 Wrocław' })
  @IsString()
  addressTo: string;

  @ApiProperty({ example: '2023-07-29T13:48:30Z' })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  assistantAssessment: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  managerId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  assistantId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  beneficiaryId: number;
}
