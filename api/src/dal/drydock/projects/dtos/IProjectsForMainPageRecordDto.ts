export interface IProjectsForMainPageRecordDto {
    ProjectId: string;

    CreatedAtOffice: boolean;

    ProjectCode: string;

    VesselName: string;

    ProjectTypeName: string;
    ProjectTypeCode?: string;

    ProjectStateName: string;
    ProjectStatusId?: string;

    Subject: string;

    ProjectManager: string;
    ProjectManagerUid?: string;

    ProjectStatusName: string;

    VesselUid: string;
    VesselId?: string;

    StartDate: Date;

    EndDate: Date;

    TaskManagerUid: string;
}
