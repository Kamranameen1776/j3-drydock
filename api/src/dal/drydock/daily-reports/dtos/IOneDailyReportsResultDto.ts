import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface IOneDailyReportsResultDto {
    uid: string;
    ReportName: string;
    ReportDate: string;
    ReportUpdateName: string;
    JobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
