import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '@patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { PatientQuery } from '@patients/interfaces/patientQuery';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async importPatients(patients: Partial<Patient>[]): Promise<number> {
    // 데이터가 비어있으면 바로 종료
    if (patients.length === 0) return 0;

    const mergedMap = new Map<string, Partial<Patient>>();

    for (let i = 0; i < patients.length; i++) {
      const currentData = patients[i];
      const key = `${currentData.name}_${currentData.phone}_${currentData.chartNo ?? ''}`;

      if (!mergedMap.has(key)) {
        mergedMap.set(key, { ...currentData });
      } else {
        const existingData = mergedMap.get(key);
        // 빈 값은 병합하지 않음
        for (const field of ['chartNo', 'regNo', 'address', 'memo']) {
          const newVal = currentData[field];
          if (newVal !== null && newVal !== undefined && newVal !== '') {
            existingData[field] = newVal;
          }
        }
      }
    }

    const mergedPatients = Array.from(mergedMap.values());

    // DB에 이미 존재하는 동일한 환자 조회. [이름, 전화번호, 차트번호(nullable)]
    const duplicatedPatients = await this.patientRepository.find({
      where: mergedPatients.map((p) => ({
        name: p.name,
        phone: p.phone,
        chartNo: p.chartNo ?? null,
      })),
    });

    // 기존 환자들 Map으로 변환해 빠르게 조회할 수 있도록 구성
    // '이름_전화번호_차트번호(nullable)'로 중복 확인
    const duplicatePatientMap = new Map(
      duplicatedPatients.map((e) => [
        `${e.name}_${e.phone}_${e.chartNo ?? ''}`,
        e,
      ]),
    );

    // 삽입할 환자, 업데이트할 환자 담을 배열 초기화
    const toInsert: Partial<Patient>[] = [];
    const toUpdate: { id: string; data: Partial<Patient> }[] = [];

    // 환자 데이터를 하나씩 순회하며 Map에 같은 키가 있으면 update, 없으면 insert 대상에 추가
    for (const patient of patients) {
      const key = `${patient.name}_${patient.phone}_${patient.chartNo ?? ''}`;
      const existing = duplicatePatientMap.get(key);

      if (existing) {
        toUpdate.push({ id: existing.id, data: patient });
      } else {
        toInsert.push(patient);
      }
    }

    // 등록할 환자 save()로 일괄 삽입
    if (toInsert.length) {
      await this.patientRepository.save(toInsert);
    }

    // 기존 환자 update()로 개별 업데이트
    for (const { id, data } of toUpdate) {
      await this.patientRepository.update(id, data);
    }

    // 총 처리된 환자 수 return
    return toInsert.length + toUpdate.length;
  }

  async findPatients(query: PatientQuery) {
    const { page, limit, name, phone, chartNo } = query;

    const where: any = {};
    if (name) where.name = name;
    if (phone) where.phone = phone;
    if (chartNo) where.chartNo = chartNo;

    const [data, total] = await this.patientRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    return {
      total,
      page,
      count: data.length,
      data,
    };
  }
}
