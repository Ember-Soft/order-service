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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { User } from 'src/common/decorators/user.decorator';
import { GemelloUser } from 'src/common/types/user';
import { GetRequestData } from './models/getRequestData.model';
import { CreateRequestData } from './models/createRequestData.model';
import { RequestService } from './request.service';
import { Request } from '@prisma/client';
import { AssignAssistantsData } from './models/assignAssistantsData.model';
import { PatchRequestData } from './models/patchRequestData.model';

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
    this.requestService.patchRequest(Number.parseInt(id), data);
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
