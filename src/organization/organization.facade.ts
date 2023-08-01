import { Injectable } from '@nestjs/common';
import { GemelloUserContext } from 'src/common/decorators/gemelloUserContext.decorator';
import { Facade } from 'src/common/types/facade';
import { v4 as uuid } from 'uuid';

interface OrganizationConfig {
  organizationId: string;
  serviceId: string;
  assistants: string[];
  manager: string;
}

@Injectable()
export class OrganizationFacade implements Facade {
  private organizationId = uuid();
  public async getHealth() {
    return true;
  }

  public async getOrganizationConfigForOrder(
    userContext: GemelloUserContext,
  ): Promise<OrganizationConfig> {
    return {
      organizationId: this.organizationId,
      serviceId: '5',
      assistants: ['dominik'],
      manager: 'krzysztof',
    };
  }
}
