import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@Inject('CHAT_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async getHello() {
    this.client.emit({ cmd: 'order-created' }, { data: 'hello' }).subscribe();
  }

  getUser() {
    return this.client
      .emit({ cmd: 'user-created' }, { data: 'user' })
      .subscribe();
  }
}
