import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export interface ICreateDailyReportsDto {
    uid: string;
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    JobOrdersUpdate: Array<JobOrdersUpdatesDto>;
    UserUid: string;
    CreatedAt: Date;
    ActiveStatus: boolean;
}
