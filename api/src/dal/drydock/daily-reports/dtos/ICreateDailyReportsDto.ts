export interface ICreateDailyReportsDto {
    uid: string;
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    UserUid: string;
    CreatedAt: Date;
    ActiveStatus: boolean;
}
