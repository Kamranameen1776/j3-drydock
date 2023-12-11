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

    ShipYard: string;
    ShipYardUid: string;

    Specification: string;

    ProjectManager: string;
    ProjectManagerUid?: string;

    ProjectStatusName: string;

    VesselUid: string;
    VesselId?: string;
    VesselType?: string;

    StartDate: Date;

    EndDate: Date;

    TaskManagerUid: string;
}
