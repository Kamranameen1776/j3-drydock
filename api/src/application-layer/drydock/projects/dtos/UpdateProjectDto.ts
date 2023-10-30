// TODO: check that all fields can be updated
export class UpdateProjectDto {
    public uid: string;

    public VesselUid: string;

    public ProjectTypeUid: string;

    public Subject: string;

    public ProjectManagerUid: string;

    public StartDate: Date;

    public EndDate: Date;
}
