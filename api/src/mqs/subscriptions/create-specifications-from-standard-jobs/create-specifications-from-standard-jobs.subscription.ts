import { SynchronizerService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import { ParallelUnitOfWork, QueryRunnerManager } from '../../../application-layer/drydock/core/uof/ParallelUnitOfWork';
import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { AsyncJobsRepository } from '../../../dal/drydock/async-jobs/AsyncJobsRepository';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import {
    LibVesselsEntity,
    SpecificationDetailsEntity,
    SpecificationInspectionEntity,
    StandardJobs,
} from '../../../entity/drydock';
import { J2FieldsHistoryEntity } from '../../../entity/drydock/dbo/J2FieldsHistoryEntity';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { InfraService } from '../../../external-services/drydock/InfraService';
import { CreateSpecificationFromStandardJobsSubscriptionDto } from './create-specifications-from-standard-jobs.dto';

export class CreateSpecificationFromStandardJobsSubscription {
    specificationRepository = new SpecificationDetailsRepository();
    uow = new ParallelUnitOfWork();
    specificationDetailsService = new SpecificationService();
    vesselsRepository = new VesselsRepository();
    projectRepository = new ProjectsRepository();
    subItemsRepository = new SpecificationDetailsSubItemsRepository();
    specificationDetailsAudit = new SpecificationDetailsAuditService();
    infraService = new InfraService();
    asyncJobsRepository = new AsyncJobsRepository();

    tableName = getTableName(SpecificationDetailsEntity);
    tableNameInspections = getTableName(SpecificationInspectionEntity);
    tableNameSubItems = getTableName(SpecificationDetailsSubItemEntity);
    tableNameAudit = getTableName(J2FieldsHistoryEntity);

    private async getProjectByVesselUid(
        request: CreateSpecificationFromStandardJobsSubscriptionDto,
    ): Promise<LibVesselsEntity> {
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
            specifications,
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

        await this.specificationDetailsService.TaskManagerIntegration({ Subject: subject }, vesselData, token, uid);

        await this.infraService.CopyAttachmentsFromStandardJobToSpecification(
            token,
            sj_uid,
            uid,
            '1',
            vesselData.VesselId.toString(),
            vesselData.VesselId,
        );
    }

    private async processTaskManagerTaskCreation(
        vessel: Promise<LibVesselsEntity>,
        specificationsData: { specification: SpecificationDetailsEntity; standardJob: StandardJobs }[],
        token: string,
    ) {
        // According to bug (786190) in task manager, we need to create tasks in order
        // to avoid the bug.
        // If we create tasks in parallel, the bug will occur.
        // When bug will be fixed we can switch to parallel execution.
        for (const specification of specificationsData) {
            await this.processTaskManagerIntegration(
                specification.specification.Subject,
                vessel,
                token,
                specification.standardJob.uid,
                specification.specification.TecTaskManagerUid,
            );
        }
    }

    public async MainHandlerAsync(payload: CreateSpecificationFromStandardJobsSubscriptionDto) {
        const vessel = this.getProjectByVesselUid(payload);

        const attachmentsPromises: Promise<void> = this.processTaskManagerTaskCreation(
            vessel,
            payload.specificationsData,
            payload.token,
        );

        try {
            await this.uow.ExecuteAsync(async (queryRunner) => {
                return Promise.all([
                    this.createSpecifications(
                        payload.specificationsData.map((spec) => spec.specification),
                        vessel,
                        queryRunner,
                    ),
                    this.createInspections(payload.specificationInspections, vessel, queryRunner),
                    this.createSubItems(payload.specificationSubItems, vessel, queryRunner),
                    this.auditSpecificationDetails(
                        payload.specificationAuditData,
                        vessel,
                        payload.createdBy,
                        queryRunner,
                    ),
                    attachmentsPromises,
                ]).then((result) => result[0]);
            }, 2);

            await this.asyncJobsRepository.UpdateAsyncJob(payload.asyncJobUid, 200, new Date());
        } catch (error) {
            await this.asyncJobsRepository.UpdateAsyncJob(payload.asyncJobUid, 500, new Date());
            throw error;
        }
    }
}
