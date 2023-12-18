export interface ICreateDailyReportsDto {
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    Remarks: string;
    UserUid: string;
    CreatedAt: Date;
}
