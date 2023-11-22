export interface IProjectsForMainPageRecordDto {
    ProjectId: string;

    CreatedAtOffice: boolean;

    ProjectCode: string;

    VesselName: string;

    ProjectTypeName: string;

    ProjectStateName: string;

    Subject: string;

    ProjectManager: string;
    ProjectManagerUid?: string;

    ProjectStatusName: string;

    VesselUid: string;

    StartDate: Date;

    EndDate: Date;
}
