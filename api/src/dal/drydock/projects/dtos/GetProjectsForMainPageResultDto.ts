import { ODataResult } from 'shared/interfaces';

export class GetProjectsForMainPageRecord {
    public ProjectId: string;

    public CreatedAtOffice: boolean;

    public ProjectCode: string;

    public VesselName: string;

    public ProjectTypeName: string;

    public ProjectStateName: string;

    public Subject: string;

    public ProjectManager: string;

    public StartDate: Date;

    public EndDate: Date;
}

export type GetProjectsForMainPageResultDto = ODataResult<GetProjectsForMainPageRecord>;
