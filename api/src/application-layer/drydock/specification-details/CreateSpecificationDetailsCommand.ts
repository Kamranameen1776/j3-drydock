import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateSpecificationDetailsDto } from './dtos/CreateSpecificationDetailsDto';
import { ProjectsRepository } from 'dal/drydock/projects/ProjectsRepository';
import { SpecificationService } from 'bll/drydock/specification-details/SpecificationService';
import { Request } from 'express';

export class CreateSpecificationDetailsCommand extends Command<Request, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    projectsRepository: ProjectsRepository;
    specificationDetailsService: SpecificationService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.projectsRepository = new ProjectsRepository();
        this.specificationDetailsService = new SpecificationService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected async MainHandlerAsync(request: Request<any, CreateSpecificationDetailsDto>): Promise<void> {
        const token: string = request.headers.authorization as string;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const vessel: LibVesselsEntity = await this.projectsRepository.GetVesselByUid(
                request.query.VesselUid as string,
            );
            const taskManagerData = await this.specificationDetailsService.TaskManagerIntegration(
                request.body,
                vessel,
                token,
            );
            request.body.TaskManagerUid = taskManagerData.uid;
            const specData = await this.specificationDetailsRepository.CreateSpecificationDetails(
                request.body,
                queryRunner,
            );
            return specData;
        });

        return;
    }
}
