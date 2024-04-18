import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { SpecificationDetailsEntity, StandardJobs } from '../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';

export interface CreateSpecificationFromStandardJobsSubscriptionDto {
    token: string;
    createdBy: string;
    ProjectUid: string;
    specificationsData: { specification: SpecificationDetailsEntity; standardJob: StandardJobs }[];
    specificationInspections: CreateInspectionsDto[];
    specificationSubItems: SpecificationDetailsSubItemEntity[];
    specificationAuditData: UpdateSpecificationDetailsDto[];
    asyncJobUid: string;
}
