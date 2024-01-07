import { Request } from 'express';

import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { GetSpecificationsStatusesDto } from './dtos/GetSpecificationStatusesDto';

export class GetSpecificationStatusesQuery extends Query<Request, GetSpecificationsStatusesDto[]> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    projectService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();
        this.projectService = new ProjectService();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(): Promise<GetSpecificationsStatusesDto[]> {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.specificationDetailsRepository.getSpecificationStatuses(
                await this.projectService.IsOffice(),
                queryRunner,
            );
        });
    }
}
