export interface IDailyReportsResultDto {
    uid: string;
    reportName: string;
    reportDate: Date;
    description: string;
    activeStatus: boolean;
    createdBy: string;
    createdAt: Date;
}
