import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { DeliveryController } from './delivery.controller';

@Module({
  imports: [KafkaModule],
  controllers: [DeliveryController],
})
export class DeliveryModule {}