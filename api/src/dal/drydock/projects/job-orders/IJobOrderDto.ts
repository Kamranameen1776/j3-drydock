export interface IJobOrderDto {
    SpecificationUid: string;

    Code: string;

    Remarks: string;

    ItemSource: string;

    SpecificationStatus: string;
    SpecificationStatusCode: string;

    Progress: number;

    DoneBy: string;

    LastUpdated: Date;

    SpecificationSubject: string;
}
