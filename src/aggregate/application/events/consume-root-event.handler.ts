import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ConsumeRootMessageDto } from '../dtos/consume-root-message.dto';
import { EventProducerService } from 'src/common/event-producer.service';
import { ProduceRootMessageDto } from '../dtos/produce-root-message.dto';

export class ConsumeRootEvent {
  constructor(public readonly body: ConsumeRootMessageDto) {}
}

@EventsHandler(ConsumeRootEvent)
export class ConsumeRootEventHandler
  implements IEventHandler<ConsumeRootEvent>
{
  constructor(private readonly eventProducerService: EventProducerService) {}
  handle(event: ConsumeRootEvent) {
    // Mapping the data to ProduceRootMessageDto
    const produceMessage = new ProduceRootMessageDto(event.body);
    // Publishing the message
    this.eventProducerService.publisher('dsb.createCompany', event.body);
  }
}
