import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

const mockClientKafka = {
  producer() {
    return {
      connect: () => ({}),
      send: (params: unknown) => ({ params }),
    };
  },
};

// const clientKafka = new Kafka({
//   clientId: 'demo-producer',
//   brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
// });

@Global()
@Module({})
export class KafkaModule {
  static register(): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: 'CLIENT_KAFKA',
          useValue: process.env.NODE_ENV === 'production' ? 'clientKafka' : mockClientKafka,
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }
}
