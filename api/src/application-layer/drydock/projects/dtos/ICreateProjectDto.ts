export interface ICreateProjectDto {
    ProjectCode?: string;

    CreatedAtOffice?: number;

    ProjectStateId?: number;

    TaskManagerUid?: string;

    VesselId: number;

    ProjectTypeUid: string;

    Subject: string;

    ProjectManagerUid: string;

    StartDate: Date;

    EndDate: Date;
}
