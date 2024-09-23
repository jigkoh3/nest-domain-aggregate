import { CustomServerKafka } from '@eqxjs/custom-kafka-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventProducerService {
  constructor() {
    console.log('********* EventProducerService.constructor *********');
  }

  async publisher(topic: string, message: any): Promise<void> {
    console.log('********* EventProducerService.publisher *********');
    console.log(
      `Publishing to ${topic} with message: ${JSON.stringify(message)}`,
    );
    console.log('********* EventProducerService.publisher *********');
    await this.produceWithRetry(
      topic,
      {
        value: message,
      },
      performance.now(),
      0,
    );
  }

  private async produceWithRetry(
    command: string,
    data: any,
    start: number,
    currentReProducceAttempts: number,
  ): Promise<void> {
    try {
      await this.emitMessage(command, data);
    } catch (error) {
      if (currentReProducceAttempts < +process.env.RETRYKAFKACOUNTMAX) {
        currentReProducceAttempts++;
        await this.produceWithRetry(
          command,
          data,
          start,
          currentReProducceAttempts,
        );
      } else {
        console.error(
          `Error producing message to kafka: ${JSON.stringify(error)}`,
        );
        // this.messageContextService.deleteContextMessage();
      }
    }
  }

  private async emitMessage(command: any, data: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      const produceMessage = {
        topic: command,
        messages: [
          {
            key: data.key ? JSON.stringify(data.key) : undefined,
            value: JSON.stringify(data.value),
          },
        ],
      };
      try {
        const record = await CustomServerKafka.getProducer().send(
          produceMessage,
        );
        resolve(record);
      } catch (error) {
        reject(error);
      }
    });
  }
}
