import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DateTime } from 'luxon';

export class OrderCreateBody {
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
}

export interface MappedOrderCreateBody {
  startDate: DateTime;
  endDate: DateTime;
  address: string;
  status: OrderStatus;
}

export class OrderPatchBody extends PartialType(OrderCreateBody) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  assistantId?: string;
}

export interface MappedOrderPatchBody extends Partial<MappedOrderCreateBody> {
  assistantId?: string;
}
