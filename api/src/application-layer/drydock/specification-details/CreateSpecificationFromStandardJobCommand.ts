import { DataUtilService, SynchronizerService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { validateAgainstModel } from '../../../common/drydock/ts-helpers/validate-against-model';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity, SpecificationDetailsEntity, SpecificationInspectionEntity } from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { InfraService } from '../../../external-services/drydock/InfraService';
import { Command } from '../core/cqrs/Command';
import { ParallelUnitOfWork, QueryRunnerManager } from '../core/uof/ParallelUnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class CreateSpecificationFromStandardJobsCommand extends Command<
    CreateSpecificationFromStandardJobDto,
    SpecificationDetailsEntity[]
> {
    specificationRepository = new SpecificationDetailsRepository();
    uow = new ParallelUnitOfWork();
    specificationDetailsService = new SpecificationService();
    vesselsRepository = new VesselsRepository();
    projectRepository = new ProjectsRepository();
    subItemsRepository = new SpecificationDetailsSubItemsRepository();
    specificationDetailsAudit = new SpecificationDetailsAuditService();
    infraService = new InfraService();

    tableName = getTableName(SpecificationDetailsEntity);
    tableNameInspections = getTableName(SpecificationInspectionEntity);
    tableNameSubItems = getTableName(SpecificationDetailsSubItemEntity);
    tableNameAudit = getTableName(J2FieldsHistoryEntity);

    protected async ValidationHandlerAsync(request: CreateSpecificationFromStandardJobDto): Promise<void> {
        await validateAgainstModel(CreateSpecificationFromStandardJobDto, request);
    }

    private async getProjectByVesselUid(request: CreateSpecificationFromStandardJobDto): Promise<LibVesselsEntity> {
        const [project] = await this.projectRepository.GetProject(request.ProjectUid);

        return this.vesselsRepository.GetVesselByUID(project.VesselUid);
    }

    private async sync(elements: string[], tableName: string, vessel: LibVesselsEntity, queryRunner: QueryRunner) {
        const condition = `uid IN ('${elements.join(`','`)}')`;
        // SYNCING
        await SynchronizerService.dataSynchronizeByConditionManager(
            queryRunner.manager,
            tableName,
            vessel.VesselId,
            condition,
        );
    }

    private async createInspections(
        specificationInspections: CreateInspectionsDto[],
        vessel: Promise<LibVesselsEntity>,
        queryRunner: QueryRunnerManager,
    ) {
        if (specificationInspections.length > 0) {
            const tasks = await this.specificationRepository.CreateSpecificationInspectionTasks(
                specificationInspections,
                queryRunner,
            );
            await Promise.all(
                tasks.map(async (task) => this.sync(task.uids, this.tableNameInspections, await vessel, task.runner)),
            );
        }
    }

    private async createSubItems(
        specificationSubItems: SpecificationDetailsSubItemEntity[],
        vessel: Promise<LibVesselsEntity>,
        queryRunner: QueryRunnerManager,
    ) {
        if (specificationSubItems.length > 0) {
            const tasks = await this.subItemsRepository.createRawSubItemsTasks(specificationSubItems, queryRunner);
            await Promise.all(
                tasks.map(async (task) => this.sync(task.uids, this.tableNameSubItems, await vessel, task.runner)),
            );
        }
    }

    private async auditSpecificationDetails(
        specificationAuditData: UpdateSpecificationDetailsDto[],
        vessel: Promise<LibVesselsEntity>,
        createdBy: string,
        queryRunner: QueryRunnerManager,
    ) {
        const auditTasks = await this.specificationDetailsAudit.auditManyCreatedSpecificationDetails(
            specificationAuditData,
            createdBy,
            queryRunner,
        );

        await Promise.all(
            auditTasks.map(async (task) => this.sync(task.uids, this.tableNameAudit, await vessel, task.runner)),
        );
    }

    private async createSpecifications(
        specifications: SpecificationDetailsEntity[],
        vessel: Promise<LibVesselsEntity>,
        queryRunner: QueryRunnerManager,
    ) {
        const tasks = await this.specificationRepository.createSpecificationsFromStandardJob(
            await Promise.all(specifications),
            queryRunner,
        );
        await Promise.all(tasks.map(async (task) => this.sync(task.uids, this.tableName, await vessel, task.runner)));
        return specifications;
    }

    private async processTaskManagerIntegration(
        subject: string,
        vessel: Promise<LibVesselsEntity>,
        token: string,
        sj_uid: string,
        uid: string,
    ) {
        const vesselData = await vessel;

        await this.specificationDetailsService.TaskManagerIntegration(
            { Subject: subject },
            vesselData,
            token,
            new DataUtilService().newUid(),
        );

        await this.infraService.CopyAttachmentsFromStandardJobToSpecification(
            token,
            sj_uid,
            uid,
            '1',
            vesselData.VesselId.toString(),
            vesselData.VesselId,
        );
    }

    protected async MainHandlerAsync(request: CreateSpecificationFromStandardJobDto) {
        const vessel = this.getProjectByVesselUid(request);

        const specificationsData = await this.specificationRepository.getSpecificationFromStandardJob(
            request,
            request.createdBy,
        );

        const attachmentsPromises: Promise<void>[] = specificationsData.map((specification) => {
            return this.processTaskManagerIntegration(
                specification.specification.Subject,
                vessel,
                request.token,
                specification.standardJob.uid,
                specification.specification.TecTaskManagerUid,
            );
        });

        const specificationInspections: CreateInspectionsDto[] = [];
        const specificationSubItems: SpecificationDetailsSubItemEntity[] = [];
        const specificationAuditData: UpdateSpecificationDetailsDto[] = [];

        specificationsData
            .map((spec) => spec.specification)
            .forEach((specification) => {
                const inspections = specification.inspections;
                const subItems = specification.SubItems;

                if (inspections.length) {
                    const data: CreateInspectionsDto[] = inspections.map((inspection) => {
                        const item: CreateInspectionsDto = {
                            uid: DataUtilService.newUid(),
                            LIBSurveyCertificateAuthorityID: inspection.ID!,
                            SpecificationDetailsUid: specification.uid,
                        };
                        return item;
                    });

                    specificationInspections.push(...data);
                }

                if (subItems.length) {
                    const newSubItems = subItems.map((subItem) => {
                        return {
                            uid: DataUtilService.newUid(),
                            specificationDetails: {
                                uid: specification.uid,
                            } as SpecificationDetailsEntity,
                            subject: subItem.subject,
                            active_status: true,
                            discount: '0',
                        } as SpecificationDetailsSubItemEntity;
                    });

                    specificationSubItems.push(...newSubItems);
                }

                const auditData: UpdateSpecificationDetailsDto = {
                    uid: specification.uid,
                    Subject: specification.Subject,
                    Inspections: specification.inspections.map((inspection) => inspection.ID!),
                    Description: specification.Description,
                    DoneByUid: specification.DoneByUid,
                    Completion: specification.Completion,
                    Duration: specification.Duration,
                    StartDate: specification.StartDate ?? undefined,
                    EndDate: specification.EndDate ?? undefined,
                    UserId: '',
                };

                specificationAuditData.push(auditData);
            });

        return this.uow.ExecuteAsync(async (queryRunner) => {
            return Promise.all([
                this.createSpecifications(
                    specificationsData.map((spec) => spec.specification),
                    vessel,
                    queryRunner,
                ),
                this.createInspections(specificationInspections, vessel, queryRunner),
                this.createSubItems(specificationSubItems, vessel, queryRunner),
                this.auditSpecificationDetails(specificationAuditData, vessel, request.createdBy, queryRunner),
                Promise.all(attachmentsPromises),
            ]).then((result) => result[0]);
        }, Math.min(4 * (1 + Math.round(specificationsData.length / 100)), 10));
    }
}
