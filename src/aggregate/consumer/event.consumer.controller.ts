import { EntryPoint, RemoveAtSymbolPipe, ToObjectDecorator } from '@eqxjs/stub';
import { Controller, UsePipes } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ConsumeRootMessageDto } from '../application/dtos/consume-root-message.dto';
import { ConsumeRootEvent } from '../application/events/consume-root-event.handler';

@Controller()
export class EventConsumerController {
  constructor(private readonly eventBus: EventBus) {}

  @EntryPoint('deb.createOrgPartner')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventRoot(@ToObjectDecorator() data: ConsumeRootMessageDto) {
    // console.log('EventConsumerController.handleEventRoot', data);
    this.eventBus.publish(new ConsumeRootEvent(data));
  }

  @EntryPoint('dsb.companyCreated')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventDsCompleted(@ToObjectDecorator() data: any) {
    console.log('EventConsumerController.handleEventDsCompleted', data);
  }

  @EntryPoint('dsb.createCompanyFailed')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventDsFailed(@ToObjectDecorator() data: any) {
    console.log('EventConsumerController.handleEventDsFailed', data);
  }
}
