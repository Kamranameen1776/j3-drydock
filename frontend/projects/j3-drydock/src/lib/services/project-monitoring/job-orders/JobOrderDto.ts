import { JobOrderStatus } from '../../../components/project-details/project-monitoring/job-orders/dtos/JobOrderStatus';

export interface JobOrderDto {
  JobOrderUid: string;

  SpecificationUid: string;

  Remarks: string;

  Subject: string;

  SpecificationStartDate: Date;

  SpecificationEndDate: Date;

  Status: JobOrderStatus;
}
