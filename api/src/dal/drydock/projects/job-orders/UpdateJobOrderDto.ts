import { JobOrderStatus } from './JobOrderStatus';

export class UpdateJobOrderDto {
    SpecificationUid: string;

    SpecificationStartDate: string;

    SpecificationEndDate: string;

    Progress: number;

    Status: JobOrderStatus;

    Subject: string;

    LastUpdated: Date;
}
