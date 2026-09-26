import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { DeliveryController } from './delivery.controller';
import { SimulatorService } from './simulator.service';

@Module({
  imports: [KafkaModule],
  controllers: [DeliveryController],
  providers: [SimulatorService],
})
export class DeliveryModule {}