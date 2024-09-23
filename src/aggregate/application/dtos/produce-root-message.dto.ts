import { Expose } from 'class-transformer';
import { ConsumeRootMessageDto } from './consume-root-message.dto';

export class ProduceRootMessageDto {
  constructor(data: ConsumeRootMessageDto) {
    this.example = data.example;
    this.referredType = data.referredType;
  }

  example: string;
  @Expose({ name: '@referredType' })
  referredType: string;
}
