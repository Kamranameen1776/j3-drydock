export interface IJobOrderDto {
    JobOrderUid: string;

    SpecificationUid: string;

    Code: string;

    Subject: string;

    Remarks: string;

    ItemSource: string;

    Status: string;

    SpecificationStatus: string;

    Progress: number;

    Responsible: string;

    LastUpdated: Date;

    SpecificationStartDate: Date;

    SpecificationEndDate: Date;

    SpecificationSubject: string;
}
