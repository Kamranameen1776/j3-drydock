export interface IJobOrderDto {
    JobOrderUid: string;

    SpecificationUid: string;

    Code: string;

    Subject: string;

    Remarks: string;

    ItemSource: string;

    Status: string;

    Progress: number;

    Responsible: string;

    LastUpdated: Date;
}
