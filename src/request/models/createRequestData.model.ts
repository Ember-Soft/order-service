import { ApiProperty } from '@nestjs/swagger';
import { HelpType, RequestResponse } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { DateTime } from 'luxon';

export class CreateRequestData {
  @ApiProperty({ example: 1 })
  @IsNumber()
  orgId: number;

  @ApiProperty({ example: RequestResponse.PENDING, enum: RequestResponse })
  @IsEnum(RequestResponse)
  response: RequestResponse;

  @ApiProperty({ example: HelpType.TRANSPORT, enum: HelpType })
  @IsEnum(HelpType)
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
}

export interface MappedRequestCreateBody
  extends Omit<CreateRequestData, 'termFrom' | 'termTo'> {
  termFrom: DateTime;
  termTo: DateTime;
}
