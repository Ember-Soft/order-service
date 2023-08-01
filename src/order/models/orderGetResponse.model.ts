import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class OrderGetResponse {
  @IsString()
  @ApiProperty()
  orderId: string;

  @IsString()
  @ApiProperty()
  beneficiaryId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  assistantId: string | undefined;

  @ApiProperty({ example: '2023-07-28T13:48:30Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-07-29T13:48:30Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'ul. Grumwaldzka 11, 51-222 Wrocław' })
  @IsString()
  address: string;

  @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus })
  @IsEnum({ enum: OrderStatus })
  status: OrderStatus;

  @IsString()
  @ApiProperty()
  organizationId: string;

  @IsString()
  @ApiProperty()
  serviceId: string;
}
