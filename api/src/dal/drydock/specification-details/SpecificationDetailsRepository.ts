import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner } from 'typeorm';

import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { GetRequisitionsResponseDto } from '../../../application-layer/drydock/specification-details/dtos/GetRequisitionsResponseDto';
import { GetSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto';
import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';
import { UpdateSpecificationPmsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { SpecificationDetailsGridFiltersKeys } from '../../../application-layer/drydock/specification-details/SpecificationDetailsConstants';
import { className } from '../../../common/drydock/ts-helpers/className';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import {
    ItemName,
    J3PrcCompanyRegistryEntity,
    J3PrcPo,
    J3PrcRequisition,
    J3PrcRfqEntity,
    JmsDtlWorkflowConfigDetailsEntity,
    LibItemSourceEntity,
    LibSurveyCertificateAuthority,
    LibUserEntity,
    LibVesselsEntity,
    LibVesseltypes,
    PriorityEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    SpecificationInspectionEntity,
    SpecificationPmsEntity,
    SpecificationRequisitionsEntity,
    StandardJobs,
    TecTaskManagerEntity,
    TmDdLibDoneBy,
    TmDdLibMaterialSuppliedBy,
} from '../../../entity/drydock';
import { J3PmsLibFunction } from '../../../entity/drydock/dbo/J3PmsLibFunctionEntity';
import { JmsDtlWorkflowConfigEntity } from '../../../entity/drydock/dbo/JMSDTLWorkflowConfigEntity';
import { J3PrcTaskStatusEntity } from '../../../entity/drydock/prc/J3PrcTaskStatusEntity';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { TaskManagerConstants } from '../../../shared/constants';
import { ODataResult } from '../../../shared/interfaces';
import { DictionariesRepository } from '../dictionaries/DictionariesRepository';
import { RepoUtils } from '../utils/RepoUtils';
import {
    CreateInspectionsDto,
    ICreateSpecificationDetailsDto,
    InspectionsResultDto,
    PmsJobsData,
    SpecificationDetailsResultDto,
} from './dtos';
import { CreateSpecificationFromStandardJobDto } from './dtos/ICreateSpecificationFromStandardJobDto';
import {
    SpecificationCostUpdateQueryResult,
    SpecificationCostUpdateRequestDto,
} from './dtos/ISpecificationCostUpdateDto';

export class SpecificationDetailsRepository {
    public async getSpecificationStatuses(isOffice: number | undefined, queryRunner: QueryRunner) {
        const repository = queryRunner.manager.getRepository(JmsDtlWorkflowConfigDetailsEntity);

        let query = repository
            .createQueryBuilder('wdetails')
            .select(['wdetails.WorkflowTypeID as status', 'wdetails.StatusDisplayName as displayName'])
            .innerJoin(
                className(JmsDtlWorkflowConfigEntity),
                'wc',
                `wc.job_type = 'Specification' AND wdetails.ConfigId = wc.ID`,
            )
            .where('wdetails.ActiveStatus = 1');

        if (isOffice !== undefined) {
            query = query.andWhere('wdetails.Is_Office = :isOffice', { isOffice });
        }

        return query.execute();
    }

    public async isSpecificationIsCompleted(
        uid: string,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<boolean> {
        const repository = queryRunner.manager.getRepository(SpecificationDetailsEntity);

        // Planned is status for COMPLETE
        const result = await repository
            .createQueryBuilder('sd')
            .select(['sd.uid as uid', 'tm.Status as status'])
            .innerJoin(TecTaskManagerEntity, 'tm', 'sd.TecTaskManagerUid = tm.uid')
            .where('sd.uid = :uid AND tm.Status = :status', {
                uid,
                status: TaskManagerConstants.specification.status.Planned,
            })
            .getRawOne();

        return result !== undefined;
    }

    public async deleteSpecificationPms(data: UpdateSpecificationPmsDto, queryRunner: QueryRunner) {
        const repository = queryRunner.manager.getRepository(SpecificationPmsEntity);
        await repository.update(
            {
                SpecificationUid: data.uid,
                PMSUid: In(data.PmsIds),
            },
            {
                ActiveStatus: false,
            },
        );
    }

    public async addSpecificationPms(data: Array<PmsJobsData>, queryRunner: QueryRunner) {
        await queryRunner.manager.insert(SpecificationPmsEntity, data);
    }

    public async getSpecificationPMSJobs(uid: string): Promise<Array<SpecificationPmsEntity>> {
        const pmsRepository = getManager().getRepository(SpecificationPmsEntity);
        return pmsRepository.find({
            where: {
                SpecificationUid: uid,
                ActiveStatus: true,
            },
        });
    }

    public getRawSpecificationByUid(uid: string): Promise<SpecificationDetailsEntity> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);
        return specificationRepository.findOneOrFail({
            where: {
                uid,
                ActiveStatus: true,
            },
        });
    }

    public async findSpecInspections(uid: string): Promise<Array<InspectionsResultDto>> {
        const inspectionRepository = getManager().getRepository(SpecificationInspectionEntity);

        return inspectionRepository
            .createQueryBuilder('insp')
            .select(['ca.ID as InspectionId', 'ca.Authority as InspectionText'])
            .innerJoin(className(LibSurveyCertificateAuthority), 'ca', 'insp.LIBSurveyCertificateAuthorityID = ca.ID')
            .where('insp.SpecificationDetailsUid = :uid', { uid })
            .andWhere('insp.ActiveStatus = 1')
            .execute();
    }

    public async findOneBySpecificationUid(uid: string): Promise<SpecificationDetailsResultDto> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);

        return specificationRepository
            .createQueryBuilder('spec')
            .select([
                'spec.uid as uid',
                'spec.subject as Subject',
                'tm.Code as SpecificationCode',
                'tm.Status as StatusId',
                'wdetails.StatusDisplayName as StatusName',
                'spec.FunctionUid as FunctionUid',
                'spec.Function as "Function"',
                'spec.AccountCode as AccountCode',
                'spec.TecTaskManagerUid as TaskManagerUid',
                'spec.ItemSourceUid as ItemSourceUid',
                'its.DisplayName as ItemSourceText',
                'spec.ItemNumber as ItemNumber',
                'spec.DoneByUid as DoneByUid',
                'db.displayName as DoneByDisplayName',
                'spec.EquipmentDescription as EquipmentDescription',
                'spec.Description as Description',
                'spec.PriorityUid as PriorityUid',
                `pr.DisplayName as PriorityName`,
                'ves.VesselName AS VesselName',
                'vesType.VesselTypes AS VesselType',
                'ves.uid AS VesselUid',
                'ves.VesselId AS VesselId',
                'spec.ProjectUid AS ProjectUid',
                `usr.FirstName + ' ' + usr.LastName AS ProjectManager`,
                'usr.uid AS ProjectManagerUid',
                //TODO: strange constants, but Specifications doesnt have type. probably should stay that way
                `'dry_dock' as SpecificationTypeCode`,
                `'Dry Dock' as SpecificationTypeName`,
                'spec.EndDate AS EndDate',
                'spec.StartDate AS StartDate',
                'spec.Completion AS Completion',
                'spec.Duration AS Duration',
                'projTm.Status as ProjectStatusId',
            ])
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'spec.TecTaskManagerUid = tm.uid')
            .leftJoin(className(LibItemSourceEntity), 'its', 'spec.ItemSourceUid = its.uid')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'spec.DoneByUid = db.uid')
            .leftJoin(className(PriorityEntity), 'pr', 'spec.PriorityUid = pr.uid')
            .leftJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .leftJoin(className(TecTaskManagerEntity), 'projTm', 'proj.TaskManagerUid = projTm.uid')
            .leftJoin(className(LibVesselsEntity), 'ves', 'proj.VesselUid = ves.uid')
            .leftJoin(className(LibVesseltypes), 'vesType', 'ves.VesselType = vesType.ID')
            .leftJoin(className(LibUserEntity), 'usr', 'proj.ProjectManagerUid = usr.uid')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`) //TODO: strange merge, but Specifications doesnt have type. probably should stay that way
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status',
            )
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .distinct()
            .getRawOne();
    }

    public async GetManySpecificationDetails(
        data: Request,
        filters: Record<SpecificationDetailsGridFiltersKeys, string[]>,
    ): Promise<ODataResult<SpecificationDetailsEntity>> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder(SpecificationDetailsEntity, 'sd')
                .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.done_by_uid = db.uid')
                .leftJoin(className(TmDdLibMaterialSuppliedBy), 'msb', 'sd.material_supplied_by_uid = msb.uid')
                .leftJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid')
                .leftJoin(
                    className(SpecificationInspectionEntity),
                    'sie',
                    `sie.specification_details_uid = sd.uid and sie.active_status = 1`,
                )
                .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.tec_task_manager_uid = tm.uid')
                .select([
                    'sd.uid as uid',
                    'sd.function_uid',
                    'sd.component_uid',
                    'sd.item_number',
                    'db.displayName as db_done_by',
                    'sd.active_status',
                    'msb.materialSuppliedBy',
                    'tm.Code as code',
                    'tm.Status as status',
                    'wdetails.StatusDisplayName as statusName',
                    'sd.subject as subject',
                    'sd.project_uid',
                    'sd.ItemSourceUid as item_source_uid',
                    'its.DisplayName as item_source',
                    RepoUtils.getStringAggJoin(
                        LibSurveyCertificateAuthority,
                        'Authority',
                        'aliased.active_status = 1',
                        'inspection',
                        {
                            entity: className(SpecificationInspectionEntity),
                            alias: 'si',
                            on: 'aliased.ID = si.LIB_Survey_CertificateAuthority_ID AND si.specification_details_uid = sd.uid and si.active_status = 1',
                        },
                    ),
                ])
                .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`) //TODO: strange merge, but Specifications doesnt have type. probably should stay that way
                .innerJoin(
                    className(JmsDtlWorkflowConfigDetailsEntity),
                    'wdetails',
                    'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status',
                )
                .groupBy(
                    [
                        'sd.uid',
                        'sd.function_uid',
                        'sd.component_uid',
                        'sd.item_number',
                        'db.displayName',
                        'sd.active_status',
                        'msb.materialSuppliedBy',
                        'tm.Code',
                        'tm.Status',
                        'wdetails.StatusDisplayName',
                        'sd.subject',
                        'sd.project_uid',
                        'sd.item_source_uid',
                        'its.display_name',
                    ].join(', '),
                )
                .where('sd.active_status = 1');

            if (filters.inspectionId?.length) {
                query.andWhere(`sie.LIB_Survey_CertificateAuthority_ID IN (:...inspectionId)`, {
                    inspectionId: filters.inspectionId,
                });
            }

            query.getSql();

            const [sql, params] = query.getQueryAndParameters();
            return oDataService.getJoinResult(sql, params);
        } catch (error) {
            throw new Error(
                `Method: GetSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }

    public async findSpecificationsForProject(projectUid: string): Promise<SpecificationDetailsEntity[]> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);
        return specificationRepository.find({
            where: {
                ProjectUid: projectUid,
                ActiveStatus: true,
            },
        });
    }

    public async getSpecificationCostUpdates(
        data: Req<SpecificationCostUpdateRequestDto>,
    ): Promise<ODataResult<SpecificationCostUpdateQueryResult>> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
            .createQueryBuilder(SpecificationDetailsEntity, 'sd')
            .distinct()
            .select([
                'sd.uid as uid',
                'sd.subject as subject',
                'sd.item_number as itemNumber',
                'sd.description as description',
                'sdsi.uid as subItemUid',
                'sdsi.subject as subItemSubject',
                'sdsi.cost as subItemCost',
                'sdsi.utilized as subItemUtilized',
                'tm.Code as code',
                'tm.Status as statusId',
                'wdetails.StatusDisplayName as status',
                'SUM(sdsi.cost) OVER (PARTITION BY sd.uid) as estimatedCost',
                'SUM(sdsi.utilized) OVER (PARTITION BY sd.uid) as utilizedCost',
                '(SUM(sdsi.cost) OVER (PARTITION BY sd.uid)) - (SUM(sdsi.utilized) OVER (PARTITION BY sd.uid)) as variance',
            ])
            .leftJoin(
                className(SpecificationDetailsSubItemEntity),
                'sdsi',
                'sd.uid = sdsi.specification_details_uid and sdsi.active_status = 1',
            )
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.tec_task_manager_uid = tm.uid')
            .innerJoin(className(ProjectEntity), 'proj', 'sd.project_uid = proj.uid')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`)
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status',
            )
            .where('sd.active_status = 1')
            .andWhere(`proj.uid = :projectUid`, { projectUid: data.body.projectUid });

        const [sql, parameters] = query.getQueryAndParameters();

        return oDataService.getJoinResult(sql, parameters);
    }

    public async CreateSpecificationDetails(data: ICreateSpecificationDetailsDto, queryRunner: QueryRunner) {
        data.CreatedAt = new Date();
        data.ActiveStatus = true;

        data.uid = data.uid ?? new DataUtilService().newUid();
        await queryRunner.manager.insert(SpecificationDetailsEntity, data);
        return data.uid as string;
    }

    public async createSpecificationFromStandardJob(
        data: CreateSpecificationFromStandardJobDto,
        createdBy: string,
        queryRunner: QueryRunner,
    ) {
        const standardJobRepository = getManager().getRepository(StandardJobs);
        const dictionariesRepository = new DictionariesRepository();

        const standardJobs = await standardJobRepository.find({
            where: {
                uid: In(data.StandardJobUid),
            },
            select: ['uid', 'functionUid', 'description', 'subject', 'function'],
            relations: ['subItems', 'inspection', 'doneBy', 'materialSuppliedBy'],
        });
        const standardJobsItemSource = await dictionariesRepository.getItemSourceByName(ItemName.StandardJob);

        const specifications = standardJobs.map((standardJob) => {
            const specification = new SpecificationDetailsEntity();
            specification.uid = new DataUtilService().newUid();
            specification.FunctionUid = standardJob.functionUid;
            specification.Function = standardJob.function;
            specification.Description = standardJob.description;
            specification.Subject = standardJob.subject;
            specification.CreatedByUid = createdBy;
            specification.CreatedAt = new Date();
            specification.ActiveStatus = true;
            specification.MaterialSuppliedByUid = standardJob.materialSuppliedBy?.uid!;
            specification.DoneByUid = standardJob.doneBy?.uid!;
            specification.ItemSourceUid = standardJobsItemSource.uid;
            specification.ProjectUid = data.ProjectUid;
            specification.inspections = standardJob.inspection.map((inspection) => {
                const item = new LibSurveyCertificateAuthority();
                item.ID = inspection.ID!;

                return item;
            }) as LibSurveyCertificateAuthority[];
            specification.SubItems = standardJob.subItems.map((subItem) => {
                const item = new SpecificationDetailsSubItemEntity();
                item.uid = new DataUtilService().newUid();
                item.subject = subItem.subject;

                return item;
            });
            return { specification, standardJob };
        });

        await queryRunner.manager.insert(
            SpecificationDetailsEntity,
            specifications.map((s) => s.specification),
        );

        return specifications;
    }

    public async updateSpecificationTmUid(specificationUid: string, taskManagerUid: string, queryRunner: QueryRunner) {
        const specification = new SpecificationDetailsEntity();
        specification.TecTaskManagerUid = taskManagerUid;
        return queryRunner.manager.update(SpecificationDetailsEntity, specificationUid, specification);
    }

    public async CreateSpecificationInspection(data: Array<CreateInspectionsDto>, queryRunner: QueryRunner) {
        return queryRunner.manager.insert(SpecificationInspectionEntity, data);
    }

    public async UpdateSpecificationInspection(
        data: Array<CreateInspectionsDto>,
        SpecificationDetailsUid: string,
        queryRunner: QueryRunner,
    ) {
        //get all by specUid
        const repository = queryRunner.manager.getRepository(SpecificationInspectionEntity);
        const allRecords = await repository.find({
            where: {
                SpecificationDetailsUid,
                ActiveStatus: true,
            },
        });
        //filter all need to be removed, remove
        const remove = allRecords.filter((r) => {
            return !data.find((d) => d.LIBSurveyCertificateAuthorityID === r.LIBSurveyCertificateAuthorityID);
        });
        if (remove.length) {
            await repository.update(
                {
                    uid: In(remove.map((i) => i.uid)),
                },
                {
                    ActiveStatus: false,
                },
            );
        }
        //filter all need to be created, create
        const create = data.filter((d) => {
            return !allRecords.find((r) => d.LIBSurveyCertificateAuthorityID === r.LIBSurveyCertificateAuthorityID);
        });
        if (create.length) {
            await this.CreateSpecificationInspection(create, queryRunner);
        }
        return;
    }

    public async UpdateSpecificationDetailsByEntity(
        specificationDetails: SpecificationDetailsEntity,
        queryRunner: QueryRunner,
    ) {
        return queryRunner.manager.update(SpecificationDetailsEntity, specificationDetails.uid, specificationDetails);
    }

    public async DeleteSpecificationDetails(uid: string, queryRunner: QueryRunner) {
        const spec = new SpecificationDetailsEntity();
        spec.ActiveStatus = false;
        return queryRunner.manager.update(SpecificationDetailsEntity, uid, spec);
    }

    public getSpecificationRequisitions(
        data: GetSpecificationRequisitionsRequestDto,
    ): Promise<ODataResult<GetRequisitionsResponseDto>> {
        const oDataService = new ODataService(data, getConnection);
        const specificationUid = data.body.uid;

        const query = getManager()
            .createQueryBuilder(J3PrcRequisition, 'rq')
            .distinct(true)
            .select([
                'rq.uid as uid',
                'rq.requisition_number as number',
                'ts.statusId statusId',
                'ts.statusDisplayName statusDisplayName',
                'rq.delivery_date as deliveryDate',
                'port.PORT_NAME as port',
                'rq.description as description',
                'urg.urgencys as priority',
                'po.poDate as poDate',
                'po.total_value as amount',
                'po.total_value as value',
                'supplier.registered_name as supplier',
            ])
            .innerJoin(SpecificationRequisitionsEntity, 'sr', 'sr.requisition_uid = rq.uid')
            .innerJoin(SpecificationDetailsEntity, 'sd', 'sr.specification_uid = sd.uid AND sd.active_status = 1')
            .innerJoin('Lib_Ports', 'port', 'rq.delivery_port_id = port.PORT_ID')
            .innerJoin('lib_urgency', 'urg', 'urg.uid = rq.urgency_uid')
            .innerJoin(J3PrcPo, 'po', 'rq.uid = po.requisition_uid')
            .innerJoin(J3PrcRfqEntity, 'rfq', 'rq.uid = rfq.requisition_uid')
            .innerJoin(J3PrcCompanyRegistryEntity, 'supplier', 'rfq.supplier_uid = supplier.uid')
            .innerJoin(J3PrcTaskStatusEntity, 'ts', 'rq.uid = ts.objectUid')
            .where(`sd.uid = :specificationUid`, { specificationUid })
            .andWhere('rq.active_status = 1')
            .getSql();

        return oDataService.getJoinResult(query);
    }

    public async linkSpecificationRequisitions(
        data: LinkSpecificationRequisitionsRequestDto,
        queryRunner: QueryRunner,
    ): Promise<SpecificationRequisitionsEntity[]> {
        const specificationUid = data.specificationUid;
        const requisitionUid = data.requisitionUid;

        const existingEntities = await queryRunner.manager
            .createQueryBuilder(SpecificationRequisitionsEntity, 'sr')
            .select(['sr.specificationUid', 'sr.requisitionUid', 'sr.uid', 'sr.activeStatus'])
            .where(`sr.specificationUid = :specificationUid`, { specificationUid })
            .andWhere(`sr.requisitionUid IN (:...requisitionUid)`, { requisitionUid })
            .getMany();

        const existingRequisitionUid = existingEntities.map((entity) => entity.requisitionUid);
        const newRequisitionUid = requisitionUid.filter((uid) => !existingRequisitionUid.includes(uid));

        const newEntities = [...existingEntities.map((entity) => ({ ...entity, activeStatus: true }))];

        newRequisitionUid.forEach((uid) => {
            const specificationRequisition = new SpecificationRequisitionsEntity();
            specificationRequisition.specificationUid = specificationUid;
            specificationRequisition.requisitionUid = uid;
            newEntities.push(specificationRequisition);
        });

        return queryRunner.manager.save(SpecificationRequisitionsEntity, newEntities);
    }

    public async deleteSpecificationRequisitions(
        data: DeleteSpecificationRequisitionsRequestDto,
        queryRunner: QueryRunner,
    ): Promise<void> {
        const specificationUid = data.specificationUid;
        const requisitionUid = data.requisitionUid;

        await queryRunner.manager
            .createQueryBuilder(SpecificationRequisitionsEntity, 'sr')
            .update()
            .set({ activeStatus: false })
            .where(`specification_uid = :specificationUid`, { specificationUid })
            .andWhere(`requisition_uid = :requisitionUid`, { requisitionUid })
            .execute();
    }

    public async TryGetSpecification(specificationUid: string): Promise<SpecificationDetailsEntity | undefined> {
        const jobOrdersRepository = getManager().getRepository(SpecificationDetailsEntity);

        return jobOrdersRepository.findOne({
            where: {
                uid: specificationUid,
            },
        });
    }

    public async findSpecificationsForProjectReport(projectUid: string): Promise<SpecificationForReport[]> {
        const res = (await getManager()
            .createQueryBuilder(SpecificationDetailsEntity, 'sd')
            .select([
                'sd.uid as uid',
                'sd.subject as Subject',
                'sd.FunctionUid as FunctionUid',
                'sd.AccountCode as AccountCode',
                'sd.TecTaskManagerUid as TaskManagerUid',
                'sd.ItemSourceUid as ItemSourceUid',
                'sd.EquipmentDescription as EquipmentDescription',
                'sd.Description as Description',
                'sd.ProjectUid AS ProjectUid',

                'tm.Code as SpecificationCode',
            ])
            .where('sd.ProjectUid = :projectUid', { projectUid })
            .andWhere('sd.active_status = 1')
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'sd.TecTaskManagerUid = tm.uid')
            .getRawMany()) as any[];

        for (const specification of res) {
            specification.functionTree = await this.getFunctionTree(specification.FunctionUid);
        }
        return res;
    }

    private async fetchFunctionByUID(uid: string): Promise<J3PmsLibFunction | undefined> {
        return getManager().createQueryBuilder(J3PmsLibFunction, 'pms_fn').where('pms_fn.uid = :uid', { uid }).getOne();
    }

    // with Node 20.x.x and latest typeorm we could rewrite it using withRecursive CTE
    // Now usage of this method leads to a lot of queries to the database
    // To be exact: N * M
    // N - number of specifications
    // M - number of functions in the tree
    // So for some product cases it could be even 1000 queries
    // And it can be a performance bottleneck and lead to timeouts in some cases
    // So we need to rewrite it to be just 1 query
    private async getFunctionTree(functionUid: string): Promise<{ rootFunction: string; functionPath: string }> {
        const getParentFunction = async (uid: string): Promise<J3PmsLibFunction | undefined> => {
            return this.fetchFunctionByUID(uid);
        };

        let currentFunction = await this.fetchFunctionByUID(functionUid);
        if (!currentFunction) {
            throw new Error('Function with the given UID not found');
        }

        const functionPath = [];
        let rootFunction = '';

        while (currentFunction.parent_function_uid) {
            const parentFunction = await getParentFunction(currentFunction.parent_function_uid);
            if (parentFunction) {
                functionPath.unshift(parentFunction.name);
                currentFunction = parentFunction;
            } else {
                break;
            }
        }

        // The root function is the last 'currentFunction' in the loop
        rootFunction = currentFunction.name!;

        // Remove the root function name from the path if it exists
        if (functionPath[0] === rootFunction) {
            functionPath.shift();
        }

        return {
            rootFunction: rootFunction,
            functionPath: functionPath.join(', '),
        };
    }
}

export type SpecificationForReport = SpecificationDetailsEntity & {
    functionTree: { rootFunction: string; functionPath: string };
    SpecificationCode: string;
};
