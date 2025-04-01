export interface PatientQuery {
  page: number;
  limit: number;
  name?: string;
  phone?: string;
  chartNo?: string;
}
