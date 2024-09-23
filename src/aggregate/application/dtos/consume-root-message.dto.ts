import { Expose } from 'class-transformer';

export class ConsumeRootMessageDto {
  example: string;
  @Expose({ name: '@referredType' })
  referredType: string;
}
