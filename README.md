# Motionlabs 백엔드 채용 과제

## 개요
```angular2html
환자 데이터가 포함된 Excel 파일을 파싱하여 데이터베이스에 적재하는 서버 어플리케이션을 개발함.
```

## 기술 스택
|Name| Version |
|----|--------|
|NestJS| 9.2.0  |
|TypeScript| 5.5.3  |
|TypeORM| ^0.3.10 |
|Swagger| ^6.3.0 |

## 개발 요구 사항

### 1. Excel 파일 업로드를 통한 환자 등록 API
- 기능: 사용자가 업로드한 Excel 파일을 파싱하여 환자 데이터를 데이터베이스에 저장
- 세부 사항:
    - [x] 중복된 식별자를 가진 경우 기존 데이터를 업데이트
    - [x] 전화번호(휴대폰번호)는 Hyphen(-)을 제거한 11자리만 저장
    - [x] 주민등록번호는 생년월일 및 성별 식별값만 저장
    - [x] Response Type 구현(totalRows, processedRows, skippedRows)

### 2. 환자 목록 조회 API
- 기능: 데이터베이스에 저장된 환자 목록 조회 기능
- 세부 사항:
    - [x] 페이지네이션 지원
    - [x] 이름, 전화번호, 차트번호로 필터링해 검색 기능 구현
    - [x] 응답에 총 환자 수, 조회된 데이터 목록 포함(total, page, count, data)

## 테스트 방법

### Git에서 불러오기
```angular2html
git clone https://github.com/kkh4323/motionlabs_project.git
```

### NPM 패키지 불러오기
```angular2html
npm install
```

### Docker compose 실행 (nginx, backend, database)
```angular2html
docker compose up -d
```

### API 테스트 (Swagger)
```angular2html
http://localhost:8080/api-docs
```

### Swagger 화면
![Swagger 화면](../motionlabs_assignment/image/motionlabs_swagger.png)

### 서버 HealthCheck API 테스트 (Terminus)
![Swagger 헬스체크](../motionlabs_assignment/image/Swagger_test_healthcheck.png)

### 환자 등록 API 테스트
![Swagger 환자 등록](../motionlabs_assignment/image/Swagger_test_post_patients.png)

### 환자 목록 조회 API 테스트
![Swagger 환자 목록 조회](../motionlabs_assignment/image/Swagger_test_get_patients_1.png)
![Swagger 환자 목록 조회](../motionlabs_assignment/image/Swagger_test_get_patients_2.png)

## Stay in touch
- 이름: 김강호(Kim Kangho)
- E-mail: kkh4323@naver.com