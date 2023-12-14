import { JobOrderStatus } from '../../../../../dal/drydock/projects/job-orders/JobOrderStatus';

export interface JobOrderDto {
    JobOrderUid: string;

    SpecificationUid: string;

    Remarks: string;

    Subject: string;

    SpecificationStartDate: Date | null;

    SpecificationEndDate: Date | null;

    Status: JobOrderStatus;
}
