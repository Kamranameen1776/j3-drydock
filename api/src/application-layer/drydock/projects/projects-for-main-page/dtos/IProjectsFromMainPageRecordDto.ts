export interface IProjectsFromMainPageRecordDto {
    ProjectId: string;

    ProjectCode: string;

    VesselName: string;
    VesselUid?: string;

    Subject: string;

    ProjectTypeName: string;

    ProjectManager: string;
    ProjectManagerUid?: string;

    Specification: string;

    ShipYard: string;

    ProjectStatusName: string;

    ProjectState: string;

    StartDate: Date;

    EndDate: Date;
}
