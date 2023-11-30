import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { CommandRequest } from '../core/cqrs/CommandRequestDto';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateSpecificationDetailsDto } from './dtos/CreateSpecificationDetailsDto';

export class CreateSpecificationDetailsCommand extends Command<CommandRequest, string> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    vesselsRepository: VesselsRepository;
    specificationDetailsService: SpecificationService;
    projectRepository: ProjectsRepository;
    uow: UnitOfWork;
    specificationDetailsAudit: SpecificationDetailsAuditService;
    tableName = 'dry_dock.specification_details';
    tableNameInspections = 'dry_dock.specification_details_LIB_Survey_CertificateAuthority';
    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsService = new SpecificationService();
        this.uow = new UnitOfWork();
        this.projectRepository = new ProjectsRepository();
        this.specificationDetailsAudit = new SpecificationDetailsAuditService();
    }

    protected async ValidationHandlerAsync({ request }: CommandRequest): Promise<void> {
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
    protected async MainHandlerAsync({ request, user }: CommandRequest): Promise<string> {
        const token: string = request.headers.authorization as string;
        const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
        const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

        // Create Specification
        const taskManagerData = await this.specificationDetailsService.TaskManagerIntegration(
            request.body,
            vessel,
            token,
        );
        return this.uow.ExecuteAsync(async (queryRunner) => {
            request.body.TecTaskManagerUid = taskManagerData.uid;
            const specData = await this.specificationDetailsRepository.CreateSpecificationDetails(
                request.body,
                queryRunner,
            );
            // SYNCING specification_details
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                specData,
                vessel.VesselId,
            );
            //Adding inspections
            const { Inspections } = request.body;
            if (Inspections.length) {
                const data = Inspections.map((item: number) => {
                    return {
                        uid: DataUtilService.newUid(),
                        LIBSurveyCertificateAuthorityID: item,
                        SpecificationDetailsUid: specData,
                    };
                });
                await this.specificationDetailsRepository.CreateSpecificationInspection(data, queryRunner);
                // SYNC inspection
                const condition = `uid IN ('${data.map((i: { uid: string }) => i.uid).join(`','`)}')`;
                await SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.tableNameInspections,
                    vessel.VesselId,
                    condition,
                );
            }
            // AUDIT
            await this.specificationDetailsAudit.auditCreatedSpecificationDetails(
                {
                    ...request.body,
                    uid: specData,
                },
                user.UserID,
                queryRunner,
            );
            return specData;
        });
    }
}
