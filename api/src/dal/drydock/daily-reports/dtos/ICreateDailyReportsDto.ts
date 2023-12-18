export interface ICreateDailyReportsDto {
    uid: string;
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    JobOrdersUpdate: [];
    UserUid: string;
    CreatedAt: Date;
    ActiveStatus: boolean;
}
