import { Body, Controller, Post } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { UpdateLocationDto } from './dto/update-location.dto/update-location.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  @Post('location')
  async updateLocation(
    @Body() location: UpdateLocationDto,
  ) {
    const event = {
      tipo: 'UbicacionActualizada',
      ...location,
    };

    await this.kafkaService.publish(
      'delivery-events',
      event,
    );

    return {
      message: 'Ubicación publicada correctamente',
      event,
    };
  }
}