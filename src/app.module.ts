import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { PatientsModule } from '@patients/patients.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),

        BACKEND_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
