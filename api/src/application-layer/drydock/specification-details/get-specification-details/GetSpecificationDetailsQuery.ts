import { SpecificationDetailsService } from '../../../../bll/drydock/specification-details/specification-details-service/SpecificationDetailsService';
import { GetSpecificationDetailsResultDto } from '../../../../dal/drydock/specification-details/dtos/GetSpecificationDetailsResultDto';
import { GetSpecificationDetailsQueryRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetSpecificationDetailsQuery extends Query<void, GetSpecificationDetailsResultDto[]> {
    specificationDetailsRepository: GetSpecificationDetailsQueryRepository;
    specificationDetailsService: SpecificationDetailsService;

    constructor() {
        super();
        this.specificationDetailsRepository = new GetSpecificationDetailsQueryRepository();
        this.specificationDetailsService = new SpecificationDetailsService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<GetSpecificationDetailsResultDto[]> {
        const latestProjectsDate = this.specificationDetailsService.LatestProjectsDate;

        const projects = await this.specificationDetailsRepository.GetSpecificationDetailsQueryRepository(
            latestProjectsDate,
        );

        return projects;
    }
}
