export interface UpdateProjectDto {
    uid: string;

    VesselUid: string;

    ProjectTypeUid: string;

    Subject: string;

    ProjectManagerUid: string;

    StartDate: Date;

    EndDate: Date;

    ShipYardId: string;
}
