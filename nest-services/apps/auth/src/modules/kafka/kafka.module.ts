import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './services/kafka-producer.service';
import { configuration } from '../../config/configuration';
import { ConfigType } from '@nestjs/config';
import { Services } from '../../constants/services';

@Module({
  // TODO: use env vars
  imports: [
    /*     ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        
      },
    ]), */
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: Services.KafkaService,
          inject: [configuration.KEY],
          useFactory: async (
            configService: ConfigType<typeof configuration>,
          ) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.kafka.clientId,
                brokers: configService.kafka.brokers,
              },
              producer: {
                allowAutoTopicCreation: true,
              },
            },
          }),
        },
      ],
    }),
  ],
  providers: [KafkaProducerService],
  exports: [ClientsModule, KafkaProducerService],
})
export class KafkaModule {}
