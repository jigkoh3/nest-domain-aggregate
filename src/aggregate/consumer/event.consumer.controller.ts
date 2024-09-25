import { EntryPoint, RemoveAtSymbolPipe, ToObjectDecorator } from '@eqxjs/stub';
import { Controller, UsePipes } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ConsumeRootMessageDto } from '../application/dtos/consume-root-message.dto';
import { ConsumeRootEvent } from '../application/events/consume-root-event.handler';
import { ConsumeCompletedEvent } from '../application/events/consume-completed-event.handler';
import { ConsumeFailedEvent } from '../application/events/consume-failed-event.handler';
import { ConsumeCompletedMessageDto } from '../application/dtos/consume-completed-message.dto';
import { ConsumeFailedMessageDto } from '../application/dtos/consume-failed-message.dto';
import { LocalStorageService } from 'src/common/local-storage.service';

@Controller()
export class EventConsumerController {
  constructor(
    private readonly eventBus: EventBus,
    private readonly localStorageService: LocalStorageService,
  ) {}

  @EntryPoint('deb.createOrgPartner')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventRoot(@ToObjectDecorator() data: ConsumeRootMessageDto) {
    // console.log('EventConsumerController.handleEventRoot', data);
    this.localStorageService.setItem('root', JSON.stringify(data));
    this.eventBus.publish(new ConsumeRootEvent(data));
  }

  @EntryPoint('dsb.companyCreated')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventDsCompleted(
    @ToObjectDecorator() data: ConsumeCompletedMessageDto,
  ) {
    // console.log('EventConsumerController.handleEventDsCompleted', data);
    const root = JSON.parse(this.localStorageService.getItem('root'));
    console.log('root', root);
    this.eventBus.publish(new ConsumeCompletedEvent(data));
  }

  @EntryPoint('dsb.createCompanyFailed')
  @UsePipes(new RemoveAtSymbolPipe())
  async handleEventDsFailed(
    @ToObjectDecorator() data: ConsumeFailedMessageDto,
  ) {
    // console.log('EventConsumerController.handleEventDsFailed', data);
    this.eventBus.publish(new ConsumeFailedEvent(data));
  }
}
