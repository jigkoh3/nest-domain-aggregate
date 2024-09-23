import { Expose } from 'class-transformer';

export class ConsumeCompletedMessageDto {
  example: string;
  @Expose({ name: '@referredType' })
  referredType: string;
}
