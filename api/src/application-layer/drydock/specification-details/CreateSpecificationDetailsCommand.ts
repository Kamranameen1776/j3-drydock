import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { AuthRequest } from '../../../controllers/drydock/core/auth-req.type';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class CreateSpecificationDetailsCommand extends Command<AuthRequest, string> {
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
        // const body: CreateSpecificationDetailsDto = plainToClass(CreateSpecificationDetailsDto, request.body);
        // const result = await validate(body);
        // if (result.length) {
        //     throw result;
        // }
        return;
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected async MainHandlerAsync(request: AuthRequest): Promise<string> {
        const token: string = request.headers.authorization as string;
        return this.uow.ExecuteAsync(async (queryRunner) => {
            // const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
            // const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

            // const taskManagerData = await this.specificationDetailsService.TaskManagerIntegration(
            //     request.body,
            //     vessel,
            //     token,
            // );
            // request.body.TecTaskManagerUid = taskManagerData.uid;
            // const specData = await this.specificationDetailsRepository.CreateSpecificationDetails(
            //     request.body,
            //     queryRunner,
            // );
            // const { Inspections } = request.body;
            // if (Inspections.length) {
            //     const data = Inspections.map((item: number) => {
            //         return {
            //             LIBSurveyCertificateAuthorityID: item,
            //             SpecificationDetailsUid: specData,
            //         };
            //     });
            //     await this.specificationDetailsRepository.CreateSpecificationInspection(data, queryRunner);
            // }
            await this.specificationDetailsAudit.auditCreatedSpecificationDetails(
                {
                    ...request.body,
                    uid: 'specData22',
                },
                request.authUser.UserID,
                queryRunner,
            );
            return 'specData';
        });
    }
}
