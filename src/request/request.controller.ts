import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { User } from 'src/common/decorators/user.decorator';
import { GemelloUser } from 'src/common/types/user';
import { RequestGetResponse } from './models/requestGetResponse.model';
import { RequestCreateBody } from './models/requestRequestBody.model';
import { RequestService } from './request.service';
import { Request } from '@prisma/client';
import { RequestAssignAssistantBody } from './models/requestAssignAssistantRequestBody.model';

@ApiBearerAuth()
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: RequestGetResponse,
    isArray: true,
  })
  public async getRequestsByUserId(@User() user: GemelloUser) {
    return this.requestService.getRequests(user.userId);
  }

  @ApiBody({ type: RequestCreateBody })
  @Post()
  public async createRequest(
    @Body() request: RequestCreateBody,
    @User() user: GemelloUser,
  ): Promise<Request> {
    return this.requestService.createRequest(
      this.mapToInternalRequest(request),
      user,
    );
  }

  @Delete(':id')
  public async deleteRequestById(@Param('id') id: string) {
    this.requestService.deleteRequest(Number.parseInt(id));
  }

  @Post(':id/assistants')
  @ApiConflictResponse({
    description: 'Some of given assistants are already assigned to request',
  })
  public async assignAssistantsToRequest(
    @Param('id') id: string,
    @Body() { assistantIds }: RequestAssignAssistantBody,
  ) {
    return this.requestService.assignAssistants(
      Number.parseInt(id),
      assistantIds,
    );
  }

  private mapToInternalRequest<
    T extends { termFrom?: string; termTo?: string },
  >({ termFrom, termTo, ...request }: T) {
    const mappedStartDate = termFrom ? DateTime.fromISO(termFrom) : undefined;
    const mappedEndDate = termFrom ? DateTime.fromISO(termTo) : undefined;

    return {
      termFrom: mappedStartDate,
      termTo: mappedEndDate,
      ...request,
    };
  }
}
