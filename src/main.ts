import { NestFactory } from '@nestjs/core';
import { AppModule, removePathTraversalCharacters } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CustomServerKafka } from '@eqxjs/custom-kafka-server';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HealthCheck, setupGracefulShutdown } from '@eqxjs/stub';

const config = yaml.load(
  readFileSync(
    join(
      process.cwd(),
      'assets',
      'config',
      `${removePathTraversalCharacters(process.env.ZONE)}.config.yaml`,
    ),
    'utf8',
  ),
);

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new CustomServerKafka({
        client: {
          brokers: [process.env.BROKERS],
          clientId: config.kafka.client['client-id'],
          ssl: config.kafka.client['ssl'],
          sasl: removePathTraversalCharacters(process.env.ZONE) !== 'local' && {
            mechanism: 'plain',
            username: process.env.API_KEY,
            password: process.env.API_SECRET,
          },
          requestTimeout: config.kafka.client['request-timeout'],
          enforceRequestTimeout: config.kafka.client['enforce-request-timeout'],
          retry: {
            initialRetryTime: config.kafka.client['initial-retry-time'],
            retries: config.kafka.client['retries'],
          },
          connectionTimeout: config.kafka.client['connection-timeout'],
        },
        consumer: {
          groupId: config.kafka.consumer['group-id'],
          allowAutoTopicCreation:
            config.kafka.consumer['allow-auto-topic-creation'],
        },
      }),
    },
  );

  await app.listen();

  setupGracefulShutdown({ app });
  await HealthCheck.startHealthCheckService(3080);
}
bootstrap();
