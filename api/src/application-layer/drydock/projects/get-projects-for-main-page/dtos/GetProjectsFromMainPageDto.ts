import { ProjectState } from "bll/drydock/entities/ProjectState";

export class GetProjectsFromMainPageDto {
    public ProjectId: string;

    public Code: string;

    public Vessel: string;

    public Subject: string;

    public ProjectType: string;

    public ProjectManager: string;

    public Specification: string;

    public ShipYard: string;

    public Status: string;

    public State: string;

    public StartDate: string;
}
