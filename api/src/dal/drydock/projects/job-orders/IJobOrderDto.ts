export interface IJobOrderDto {
    SpecificationUid: string;
    Code: string;
    Remarks: string;
    ItemSource: string;
    SpecificationStatus: string;
    SpecificationStatusCode: string;
    Progress: number;
    Responsible: string;
    LastUpdated: Date;
    SpecificationSubject: string;
    JobOrderUid?: string;
}
