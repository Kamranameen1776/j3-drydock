import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface UpdateDailyReportsDto {
  DailyReportUid?: string;
  ProjectUid?: string;
  ReportName?: string;
  UserUid?: string;
  UpdatedAt?: Date;
  JobOrdersUpdate?: JobOrdersUpdatesDto[];
}
