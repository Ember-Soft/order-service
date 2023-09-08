import { Test } from '@nestjs/testing';
import { RequestResponse } from '@prisma/client';
import { DateTime } from 'luxon';
import { OrganizationService } from 'src/organization/organization.service';
import { anything, deepEqual, instance, mock, when } from 'ts-mockito';
import { PrismaModule } from '@ember-soft/gemello-server-core';

import { AssistantOfRequestRepository } from './assistantOfRequest.repository';
import { AssistantOfRequestService } from './assistantOfRequest.service';

describe('AssistantOfRequestService', () => {
  const orgId = 1;
  const requestId = 1;

  let assistantOfRequestService: AssistantOfRequestService;
  let assistantOfRequestRepository: AssistantOfRequestRepository;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    assistantOfRequestRepository = mock(AssistantOfRequestRepository);
    organizationService = mock(OrganizationService);

    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        AssistantOfRequestRepository,
        AssistantOfRequestService,
        OrganizationService,
      ],
    })
      .overrideProvider(AssistantOfRequestRepository)
      .useValue(instance(assistantOfRequestRepository))
      .overrideProvider(OrganizationService)
      .useValue(instance(organizationService))
      .compile();

    assistantOfRequestService = moduleRef.get<AssistantOfRequestService>(
      AssistantOfRequestService,
    );
  });

  it('should correctly assign assistants', async () => {
    const memberId = 1;
    when(organizationService.getOrganizationAssistants(orgId)).thenResolve([
      {
        memberId,
        role: 'ASSISTANT',
        since: DateTime.now().toJSDate(),
        till: null,
        orgId,
      },
    ]);
    when(assistantOfRequestRepository.getMany(requestId)).thenResolve([
      {
        requestId,
        response: RequestResponse.PENDING,
        createdAt: DateTime.now().toJSDate(),
        memberId: 2,
      },
    ]);
    when(
      assistantOfRequestRepository.createMany(
        deepEqual([
          {
            memberId,
            requestId,
            response: RequestResponse.PENDING,
            createdAt: anything(),
          },
        ]),
      ),
    ).thenResolve({ count: 1 });

    const result = await assistantOfRequestService.assignAssistants({
      orgId,
      requestId,
      assistantIds: [1],
    });

    expect(result).toEqual({ count: 1 });
  });
});
