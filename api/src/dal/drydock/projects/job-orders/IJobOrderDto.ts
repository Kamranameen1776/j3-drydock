import { JobOrderStatus } from './JobOrderStatus';

export interface IJobOrderDto {
    JobOrderUid: string;

    SpecificationUid: string;

    Code: string;

    Subject: string;

    Remarks: string;

    ItemSource: string;

    Status: JobOrderStatus;

    Progress: number;

    Responsible: string;

    LastUpdated: Date;

    Updates: number;
}
