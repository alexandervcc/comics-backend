import { Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { redisStore } from 'cache-manager-redis-store';

import { ComicsModule } from './modules/comics/comics.module';
import { AuthorModule } from './modules/author/author.module';
import { KafkaModule } from './modules/kafka/kafka.module';

import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof configuration>) => {
        return {
          uri: configService.mongo.uri,
          dbName: configService.mongo.db,
        };
      },
      inject: [configuration.KEY],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigType<typeof configuration>) => {
        const store = await redisStore({
          socket: {
            host: configService.redis.host,
            port: configService.redis.port,
            passphrase: configService.redis.pass,
          },
        });
        return {
          store: store as unknown as CacheStore,
          ttl: 60000,
          isGlobal: true,
        };
      },
      inject: [configuration.KEY],
      isGlobal: true,
    }),
    KafkaModule,
    ComicsModule,
    AuthorModule,
  ],
  controllers: [],
})
export class AppModule {}
