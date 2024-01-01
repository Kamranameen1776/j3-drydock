import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface CreateDailyReportsDto {
  uid?: string;
  ProjectUid: string;
  ReportName: string;
  ReportDate?: Date | string;
  JobOrdersUpdate: JobOrdersUpdatesDto[];
}
