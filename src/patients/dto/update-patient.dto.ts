import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from '@patients/dto/create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
