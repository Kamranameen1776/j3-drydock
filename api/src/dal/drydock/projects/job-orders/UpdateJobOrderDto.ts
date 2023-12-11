import { JobOrderStatus } from './JobOrderStatus';

export class UpdateJobOrderDto {
    SpecificationUid: string;

    SpecificationStartDate: Date;

    SpecificationEndDate: Date;

    Progress: number;

    Status: JobOrderStatus;

    Subject: string;

    LastUpdated: Date;
}
