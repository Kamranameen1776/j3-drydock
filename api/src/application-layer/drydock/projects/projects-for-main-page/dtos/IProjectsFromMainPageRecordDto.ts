export interface IProjectsFromMainPageRecordDto {
    ProjectId: string;

    ProjectCode: string;

    VesselName: string;
    VesselUid?: string;
    VesselId?: string;

    Subject: string;

    ProjectTypeName: string;
    ProjectTypeCode?: string;

    ProjectManager: string;
    ProjectManagerUid?: string;

    Specification: string;

    ShipYard: string;

    ProjectStatusName: string;

    ProjectState: string;

    StartDate: Date;

    EndDate: Date;

    TaskManagerUid: string;
}
