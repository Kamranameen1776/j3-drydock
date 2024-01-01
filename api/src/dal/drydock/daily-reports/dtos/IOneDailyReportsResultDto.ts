import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface IOneDailyReportsResultDto {
    uid: string;
    projectUid: string;
    createdAt: Date;
    createdBy: string;
    reportName: string;
    reportDate: Date;
    jobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
