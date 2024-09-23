import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventProducerService } from 'src/common/event-producer.service';
import { ConsumeFailedMessageDto } from '../dtos/consume-failed-message.dto';
import { ProduceFailedMessageDto } from '../dtos/produce-failed-message.dto';

export class ConsumeFailedEvent {
  constructor(public readonly body: ConsumeFailedMessageDto) {}
}

@EventsHandler(ConsumeFailedEvent)
export class ConsumeFailedEventHandler
  implements IEventHandler<ConsumeFailedEvent>
{
  constructor(private readonly eventProducerService: EventProducerService) {}
  handle(event: ConsumeFailedEvent) {
    // Mapping the data to ProduceRootMessageDto
    const produceMessage = new ProduceFailedMessageDto(event.body);
    // Publishing the message
    this.eventProducerService.publisher(
      'dsb.createOrgPartnerFailed',
      event.body,
    );
  }
}
