import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FreezePipe } from './pipes/freeze.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@UseGuards(AuthGuard)
  //@UseInterceptors(LoggingInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  //@UseGuards(FreezePipe)
  createComic(@Body(new FreezePipe()) body: Record<string, unknown>) {
    body['xd'] = 'xd';
  }
}
