import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface IDailyReportsResultDto {
  uid: string;
  projectUid: string;
  createdBy: string;
  createdAt: Date;
  reportName: string;
  reportDate: Date;
  jobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
