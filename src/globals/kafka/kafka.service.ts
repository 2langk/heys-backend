import { Inject, Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaEvent } from './kafka.event';

@Injectable()
export class KafkaService {
  private readonly producer: Producer;

  constructor(@Inject('CLIENT_KAFKA') private readonly clientKafka: Kafka) {
    this.producer = clientKafka.producer();
    this.producer.connect();
  }

  async emit(event: KafkaEvent) {
    const { topic, data } = event;
    this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}
