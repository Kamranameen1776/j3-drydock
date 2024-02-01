import { JobOrderStatus } from '../../../../../dal/drydock/projects/job-orders/JobOrderStatus';

export interface JobOrderDto {
    JobOrderUid: string;

    SpecificationUid: string;

    Remarks: string;

    Progress: number;

    Subject: string;

    SpecificationStartDate: Date | null;

    SpecificationEndDate: Date | null;

    Status: JobOrderStatus;
}
