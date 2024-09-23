import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventProducerService } from 'src/common/event-producer.service';
import { ConsumeCompletedMessageDto } from '../dtos/consume-completed-message.dto';
import { ProduceComplatedMessageDto } from '../dtos/produce-completed-message.dto';

export class ConsumeCompletedEvent {
  constructor(public readonly body: ConsumeCompletedMessageDto) {}
}

@EventsHandler(ConsumeCompletedEvent)
export class ConsumeCompletedEventHandler
  implements IEventHandler<ConsumeCompletedEvent>
{
  constructor(private readonly eventProducerService: EventProducerService) {}
  handle(event: ConsumeCompletedEvent) {
    // Mapping the data to ProduceRootMessageDto
    const produceMessage = new ProduceComplatedMessageDto(event.body);
    // Publishing the message
    this.eventProducerService.publisher('dsb.createCompartyRole', event.body);
  }
}
