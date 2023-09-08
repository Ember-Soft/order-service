import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from '@prisma/client';
import { DateTime } from 'luxon';
import { GemelloUser, User } from '@ember-soft/gemello-server-common';

import { AssignAssistantsData } from './models/assignAssistantsData.model';
import { CreateRequestData } from './models/createRequestData.model';
import { GetRequestData } from './models/getRequestData.model';
import { PatchRequestData } from './models/patchRequestData.model';
import { RequestService } from './request.service';

@ApiBearerAuth()
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: GetRequestData,
    isArray: true,
  })
  public async getRequestsByUserId(@User() user: GemelloUser) {
    return this.requestService.getRequests(user.userId);
  }

  @ApiBody({ type: CreateRequestData })
  @Post()
  public async createRequest(
    @Body() request: CreateRequestData,
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

  @Patch(':id')
  public async patchRequestById(
    @Param('id') id: string,
    @Body() data: PatchRequestData,
  ) {
    return this.requestService.patchRequest(Number.parseInt(id), data);
  }

  @Post(':id/assistants')
  @ApiConflictResponse({
    description: 'Some of given assistants are already assigned to request',
  })
  public async assignAssistantsToRequest(
    @Param('id') id: string,
    @Body() { assistantIds }: AssignAssistantsData,
  ) {
    return this.requestService.assignAssistants(
      Number.parseInt(id),
      assistantIds,
    );
  }

  @Get(':id/assistants')
  public async getAssignedAssistantsToRequest(@Param('id') id: string) {
    return this.requestService.getAssignedAssistants(Number.parseInt(id));
  }

  @Patch(':id/assistants')
  public async patchAssignedAassistantResponse(
    @User() { userId }: GemelloUser,
    @Param('id') id: string,
    @Body() { response }: PatchRequestData,
  ) {
    return this.requestService.patchAssignedAssistantResponse({
      requestId: Number.parseInt(id),
      userId,
      response,
    });
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
