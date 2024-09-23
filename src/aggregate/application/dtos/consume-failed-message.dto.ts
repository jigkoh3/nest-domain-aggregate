import { Expose } from 'class-transformer';

export class ConsumeFailedMessageDto {
  example: string;
  @Expose({ name: '@referredType' })
  referredType: string;
}
