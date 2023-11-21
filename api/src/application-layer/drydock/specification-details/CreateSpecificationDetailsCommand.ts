import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { SynchronizerService } from 'j2utils';

import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateSpecificationDetailsDto } from './dtos/CreateSpecificationDetailsDto';

export class CreateSpecificationDetailsCommand extends Command<Request, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    vesselsRepository: VesselsRepository;
    specificationDetailsService: SpecificationService;
    projectRepository: ProjectsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsService = new SpecificationService();
        this.uow = new UnitOfWork();
        this.projectRepository = new ProjectsRepository();
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const body: CreateSpecificationDetailsDto = plainToClass(CreateSpecificationDetailsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<void> {
        const token: string = request.headers.authorization as string;
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
            const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

            const taskManagerData = await this.specificationDetailsService.TaskManagerIntegration(
                request.body,
                vessel,
                token,
            );
            request.body.TecTaskManagerUid = taskManagerData.uid;
            const specId = await this.specificationDetailsRepository.CreateSpecificationDetails(
                request.body,
                queryRunner,
            );
            const { Inspections } = request.body;
            if (Inspections.length) {
                const data = Inspections.map((item: number) => {
                    return {
                        LIBSurveyCertificateAuthorityID: item,
                        SpecificationDetailsUid: specId,
                    };
                });
                await this.specificationDetailsRepository.CreateSpecificationInspection(data, queryRunner);
            }
            await SynchronizerService.dataSynchronize('dry_dock.specification_details', 'uid', specId, vessel.VesselId);
            return specId;
        });
    }
}
