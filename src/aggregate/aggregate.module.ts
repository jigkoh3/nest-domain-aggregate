import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsumeRootEventHandler } from './application/events/consume-root-event.handler';
import { EventConsumerController } from './consumer/event.consumer.controller';
import { EventProducerService } from 'src/common/event-producer.service';

@Module({
  imports: [CqrsModule],
  controllers: [EventConsumerController],
  providers: [ConsumeRootEventHandler, EventProducerService],
})
export class AggregateModule {}
