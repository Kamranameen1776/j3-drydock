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
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class CreateSpecificationFromStandardJobsCommand extends Command<
    CreateSpecificationFromStandardJobDto,
    SpecificationDetailsEntity[]
> {
    specificationRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
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

    protected async MainHandlerAsync(request: CreateSpecificationFromStandardJobDto) {
        const vessel = this.getProjectByVesselUid(request);

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const specificationsData = await this.specificationRepository.getSpecificationFromStandardJob(
                request,
                request.createdBy,
            );

            const attachmentsPromises: Promise<void>[] = [];

            const specificationsToCreate = specificationsData.map(async (specification) => {
                const spec = specification.specification;
                const vesselData = await vessel;

                const tmResult = await this.specificationDetailsService.TaskManagerIntegration(
                    { Subject: specification.specification.Subject },
                    vesselData,
                    request.token,
                );

                spec.TecTaskManagerUid = tmResult.uid;

                attachmentsPromises.push(
                    this.infraService.CopyAttachmentsFromStandardJobToSpecification(
                        request.token,
                        specification.standardJob.uid,
                        tmResult.uid,
                        '1',
                        vesselData.VesselId.toString(),
                        vesselData.VesselId,
                    ),
                );

                return spec;
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

            await Promise.all([
                this.createSpecifications(specificationsToCreate, vessel, queryRunner),
                this.createInspections(specificationInspections, vessel, queryRunner),
                this.createSubItems(specificationSubItems, vessel, queryRunner),
                this.auditSpecificationDetails(specificationAuditData, vessel, request.createdBy, queryRunner),
                Promise.all(attachmentsPromises),
            ]);

            return Promise.all(specificationsToCreate);
        });
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
        queryRunner: QueryRunner,
    ) {
        if (specificationInspections.length > 0) {
            await this.specificationRepository.CreateSpecificationInspection(specificationInspections, queryRunner);
            await this.sync(
                specificationInspections.map((s) => s.uid).filter(Boolean) as string[],
                this.tableNameInspections,
                await vessel,
                queryRunner,
            );
        }
    }

    private async createSubItems(
        specificationSubItems: SpecificationDetailsSubItemEntity[],
        vessel: Promise<LibVesselsEntity>,
        queryRunner: QueryRunner,
    ) {
        if (specificationSubItems.length > 0) {
            await this.subItemsRepository.createRawSubItems(specificationSubItems, queryRunner);
            await this.sync(
                specificationSubItems.map((s) => s.uid),
                this.tableNameSubItems,
                await vessel,
                queryRunner,
            );
        }
    }

    private async auditSpecificationDetails(
        specificationAuditData: UpdateSpecificationDetailsDto[],
        vessel: Promise<LibVesselsEntity>,
        createdBy: string,
        queryRunner: QueryRunner,
    ) {
        const auditUids = await this.specificationDetailsAudit.auditManyCreatedSpecificationDetails(
            specificationAuditData,
            createdBy,
            queryRunner,
        );

        await this.sync(auditUids, this.tableNameAudit, await vessel, queryRunner);
    }

    private async createSpecifications(
        specifications: Promise<SpecificationDetailsEntity>[],
        vessel: Promise<LibVesselsEntity>,
        queryRunner: QueryRunner,
    ) {
        const specs = await Promise.all(specifications);

        await this.specificationRepository.createSpecificationsFromStandardJob(specs, queryRunner);
        await this.sync(
            specs.map((s) => s.uid),
            this.tableName,
            await vessel,
            queryRunner,
        );
    }
}
