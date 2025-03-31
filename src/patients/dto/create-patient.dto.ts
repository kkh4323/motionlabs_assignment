import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreatePatientDto {
  @IsOptional()
  @IsString()
  @Length(0, 255, { message: '차트번호는 255자 이하의 문자열이어야 합니다.' })
  public chartNo?: string;

  @IsString()
  @Length(1, 255, {
    message: '이름은 1자 이상 255자 이하의 문자열이어야 합니다.',
  })
  public name: string;

  @IsOptional()
  @IsString()
  @Matches(/^010\d{8}$|^010-\d{4}-\d{4}$/, {
    message: '전화번호는 숫자 11자리 혹은 (-)포함 13자리여야 합니다.',
  })
  public phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$|^\d{7}$|^\d{6}-?\d{1}\*{0,6}$|^\d{6}-?\d{7}$/, {
    message: '주민등록번호 형식이 올바르지 않습니다.',
  })
  public regNo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: '주소는 255자 이하의 문자열이어야 합니다.' })
  public address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: '메모는 255자 이하의 문자열이어야 합니다.' })
  public memo?: string;
}
