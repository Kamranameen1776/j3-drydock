import { ODataResult } from "shared/interfaces";

export class GetProjectsFromMainPageRecord {
    public ProjectId: string;

    public ProjectCode: string;

    public Vessel: string;

    public Subject: string;

    public ProjectTypeName: string;

    public ProjectManager: string;

    public Specification: string;

    public ShipYard: string;

    public ProjectStatus: string;

    public ProjectState: string;

    public StartDate: Date;

    public EndDate: Date;
}

export class GetProjectsFromMainPageResultDto implements ODataResult<GetProjectsFromMainPageRecord>{
    records: GetProjectsFromMainPageRecord[];
    count?: number | undefined;
}
