export interface ICreateDailyReportsDto {
    projectUid: string;
    reportName: string;
    reportDate: Date;
    description: string;
    createdBy: string;
    createdAt: Date;
}
