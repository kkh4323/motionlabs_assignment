import { Module } from '@nestjs/common';
import { PatientsController } from '@patients/patients.controller';
import { PatientsService } from '@patients/patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
