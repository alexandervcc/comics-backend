import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { configuration } from './config/configuration';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ValidationModule } from './modules/validation/validation.module';
import { MongooseModule } from '@nestjs/mongoose';

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
    AuthenticationModule,
    ValidationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
