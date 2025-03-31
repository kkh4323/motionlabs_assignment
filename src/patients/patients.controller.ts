import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { CreatePatientDto } from './dto/create-patient.dto';
import { validate } from 'class-validator';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  private readonly logger = new Logger(PatientsController.name);

  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '엑셀 파일 업로드로 환자 정보 등록',
    description: `Excel(.xlsx) 파일을 업로드하여 환자 데이터를 일괄 등록합니다.
    
    업로드된 파일의 각 행은 다음 필드를 포함해야 합니다:
    - 차트번호 (선택)
    - 이름 (필수)
    - 전화번호 (선택, 숫자만)
    - 주민등록번호 (선택, 6자리 생년월일 + 성별코드)
    - 주소 (선택)
    - 메모 (선택)
    
    검증을 통과한 데이터만 저장되며, 총 처리된 행 수를 응답으로 반환합니다.`,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '업로드할 Excel 파일 (.xlsx)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '파일 처리 결과를 반환합니다.',
    schema: {
      example: {
        totalRows: 100,
        processedRows: 85,
        skippedRows: 15,
      },
    },
  })
  async handleExcel(@UploadedFile() file): Promise<{
    totalRows: number;
    processedRows: number;
    skippedRows: number;
  }> {
    // 엑셀 버퍼를 읽어 첫 번째 시트만 사용
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // sheet를 json 객체 배열 rows로 변환
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const totalRows = rows.length; // 총 데이터 수

    // rows의 객체 하나씩 CreatePatientDto로 변환
    const dtos = await Promise.all(
      rows.map(async (row) => {
        const dto = plainToInstance(CreatePatientDto, {
          chartNo: row['차트번호']?.toString(),
          name: row['이름']?.toString(),
          phone: row['전화번호']
            ? String(row['전화번호']).replace(/\D/g, '') // 하이픈(-) 제거
            : null,
          regNo: this.formatRegNo(row['주민등록번호']),
          address: row['주소']?.toString(),
          memo: row['메모']?.toString(),
        });

        const errors = await validate(dto); // 유효성 검사
        return errors.length === 0 ? dto : null;
      }),
    );

    // 유효성 검사 통과한 행만 validDtos에 저장
    const validDtos = dtos.filter(
      (dto): dto is CreatePatientDto => dto !== null,
    );

    // Service에서 데이터 삽입 or 업데이트 후 성공한 횟수 저장
    const processed = await this.patientsService.importPatients(validDtos);

    this.logger.log(
      `저장된 행: ${processed}, 스킵된 행: ${totalRows - processed}`,
    );

    return {
      totalRows,
      processedRows: processed,
      skippedRows: totalRows - processed,
    };
  }

  // 주민등록번호 생년월일, 성별 식별값만 000000-0 형태로 변환
  private formatRegNo(input: string | null | undefined): string | null {
    if (!input) return null;
    const digits = input.replace(/\D/g, '');
    const birth = digits.slice(0, 6);
    const genderCode = digits.length >= 7 ? digits.charAt(6) : '0';
    return `${birth}-${genderCode}`;
  }
}
