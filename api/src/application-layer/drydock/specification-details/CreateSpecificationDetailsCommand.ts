import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { SpecificationDetailsAuditService } from '../../../bll/drydock/standard_jobs/specification-details-audit.service';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateSpecificationDetailsDto } from './dtos/CreateSpecificationDetailsDto';

export class CreateSpecificationDetailsCommand extends Command<Request, string> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    vesselsRepository: VesselsRepository;
    specificationDetailsService: SpecificationService;
    projectRepository: ProjectsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsService = new SpecificationService();
        this.uow = new UnitOfWork();
        this.projectRepository = new ProjectsRepository();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const body: CreateSpecificationDetailsDto = plainToClass(CreateSpecificationDetailsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async AfterExecution(request: Request, uid: string): Promise<void> {
        await this.specificationDetailsAudit.auditCreatedSpecificationDetails({
            uid,
            ...request.body,
        });
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected MainHandlerAsync(request: Request): Promise<string> {
        const token: string = request.headers.authorization as string;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
            const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

            const taskManagerData = await this.specificationDetailsService.TaskManagerIntegration(
                request.body,
                vessel,
                token,
            );
            request.body.TecTaskManagerUid = taskManagerData.uid;
            const specData = await this.specificationDetailsRepository.CreateSpecificationDetails(
                request.body,
                queryRunner,
            );
            const { Inspections } = request.body;
            if (Inspections.length) {
                const data = Inspections.map((item: number) => {
                    return {
                        LIBSurveyCertificateAuthorityID: item,
                        SpecificationDetailsUid: specData,
                    };
                });
                await this.specificationDetailsRepository.CreateSpecificationInspection(data, queryRunner);
            }
            return specData;
        });
    }
}
