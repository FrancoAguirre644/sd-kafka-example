import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class SimulatorService
  implements OnModuleInit, OnModuleDestroy
{
  private interval?: NodeJS.Timeout;

  private readonly posiciones = [
    {
      latitud: -34.6037,
      longitud: -58.3816,
    },
    {
      latitud: -34.6040,
      longitud: -58.3810,
    },
    {
      latitud: -34.6045,
      longitud: -58.3802,
    },
    {
      latitud: -34.6051,
      longitud: -58.3790,
    },
    {
      latitud: -34.6058,
      longitud: -58.3781,
    },
  ];

  private posicionActual = 0;

  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  onModuleInit(): void {
    console.log('Simulador de repartidor iniciado');

    this.interval = setInterval(() => {
      this.publicarUbicacion();
    }, 2000);
  }

  onModuleDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async publicarUbicacion(): Promise<void> {
    const posicion = this.posiciones[this.posicionActual];

    const event = {
      tipo: 'UbicacionActualizada',
      repartidorId: 1,
      pedidoId: 1001,
      latitud: posicion.latitud,
      longitud: posicion.longitud,
      velocidad: 32,
      estado: 'EN_REPARTO',
    };

    await this.kafkaService.publish(
      'delivery-events',
      event,
    );

    console.log('Ubicación publicada:', event);

    this.posicionActual++;

    if (this.posicionActual >= this.posiciones.length) {
      this.posicionActual = 0;
    }
  }
}