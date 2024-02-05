export interface ICreateNewProjectDto {
    uid?: string;

    ProjectCode?: string;

    CreatedAtOffice?: number;

    ProjectStateId?: number;

    TaskManagerUid?: string;

    VesselUid: string;

    ProjectTypeUid: string;

    Subject: string;

    ProjectManagerUid: string;

    StartDate: Date;

    EndDate: Date;
}
