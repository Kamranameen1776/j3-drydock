export interface ICreateDailyReportsDto {
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    Description: string;
    UserUid: string;
    CreatedAt: Date;
}
