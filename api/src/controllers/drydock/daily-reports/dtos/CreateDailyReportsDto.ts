export class CreateDailyReportsDto {
    uid: string;
    ProjectUid: string;
    ReportName: string;
    ReportDate: Date;
    UserUid: string;
    CreatedAt: Date;
    JobOrdersUpdate: [];
    ActiveStatus: boolean;
}
