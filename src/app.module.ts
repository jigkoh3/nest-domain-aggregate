import { AppInterceptor, FrameworkModule } from '@eqxjs/stub';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { AggregateModule } from './aggregate/aggregate.module';

export const removePathTraversalCharacters = (str) => {
  const pattern = /(\.\.\/|\.\/|\/|\\|%00|\*)/g;
  const sanitizedStr = str.replace(pattern, '');
  return sanitizedStr;
};

@Module({
  imports: [
    FrameworkModule.register({
      configPath: join(process.cwd(), 'assets', 'config'),
      zone: removePathTraversalCharacters(process.env.ZONE || 'local'),
    }),
    AggregateModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})
export class AppModule {}
