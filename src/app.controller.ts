import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    this.appService.getHello();
    return 'ok';
  }

  @Get('/user')
  async user(): Promise<string> {
    this.appService.getUser();
    return 'user';
  }
}
