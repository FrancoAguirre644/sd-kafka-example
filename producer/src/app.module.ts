import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [KafkaModule, DeliveryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
