import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner } from 'typeorm';

import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { GetRequisitionsResponseDto } from '../../../application-layer/drydock/specification-details/dtos/GetRequisitionsResponseDto';
import { GetSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto';
import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';
import { UpdateSpecificationPmsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationPMSRequestDto';
import { className } from '../../../common/drydock/ts-helpers/className';
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
import { JmsDtlWorkflowConfigEntity } from '../../../entity/drydock/dbo/JMSDTLWorkflowConfigEntity';
import { J3PrcTaskStatusEntity } from '../../../entity/drydock/prc/J3PrcTaskStatusEntity';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { ODataResult } from '../../../shared/interfaces';
import { DictionariesRepository } from '../dictionaries/DictionariesRepository';
import { RepoUtils } from '../utils/RepoUtils';
import {
    CreateInspectionsDto,
    ICreateSpecificationDetailsDto,
    InspectionsResultDto,
    IUpdateSpecificationDetailsDto,
    PmsJobsData,
    SpecificationDetailsResultDto,
} from './dtos';
import { CreateSpecificationFromStandardJobDto } from './dtos/ICreateSpecificationFromStandardJobDto';

export class SpecificationDetailsRepository {
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
                'wdetails.DisplayNameAction as StatusName',

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
                'ves.uid AS VesselUid',
                'ves.VesselId AS VesselId',
                'spec.ProjectUid AS ProjectUid',
                `usr.FirstName + ' ' + usr.LastName AS ProjectManager`,
                'usr.uid AS ProjectManagerUid',
                //TODO: strange constants, but Specifications doesnt have type. probably should stay that way
                `'dry_dock' as SpecificationTypeCode`,
                `'Dry Dock' as SpecificationTypeName`,
            ])
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'spec.TecTaskManagerUid = tm.uid')
            .leftJoin(className(LibItemSourceEntity), 'its', 'spec.ItemSourceUid = its.uid')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'spec.DoneByUid = db.uid')
            .leftJoin(className(PriorityEntity), 'pr', 'spec.PriorityUid = pr.uid')
            .leftJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .leftJoin(className(LibVesselsEntity), 'ves', 'proj.VesselUid = ves.uid')
            .leftJoin(className(LibUserEntity), 'usr', 'proj.ProjectManagerUid = usr.uid')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', `wc.job_type = 'Specification'`) //TODO: strange merge, but Specifications doesnt have type. probably should stay that way
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status',
            )
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .getRawOne();
    }

    public async GetManySpecificationDetails(data: Request): Promise<ODataResult<SpecificationDetailsEntity>> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder('specification_details', 'sd')
                .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.done_by_uid = db.uid')
                .leftJoin(className(TmDdLibMaterialSuppliedBy), 'msb', 'sd.material_supplied_by_uid = msb.uid')
                .leftJoin(className(LibItemSourceEntity), 'its', 'sd.ItemSourceUid = its.uid')
                .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.tec_task_manager_uid = tm.uid')
                .select([
                    'sd.uid as uid',
                    'sd.function_uid',
                    'sd.component_uid',
                    'sd.item_number',
                    'db.done_by',
                    'sd.active_status',
                    'msb.materialSuppliedBy',
                    'tm.Code as code',
                    'tm.Status as status',
                    'tm.title as subject',
                    'sd.project_uid',
                    'sd.ItemSourceUid as item_source_uid',
                    'its.DisplayName as item_source',
                    RepoUtils.getStringAggJoin(
                        LibSurveyCertificateAuthority,
                        'ID',
                        'aliased.active_status = 1',
                        'inspectionId',
                        {
                            entity: className(SpecificationInspectionEntity),
                            alias: 'si',
                            on: 'aliased.ID = si.LIB_Survey_CertificateAuthority_ID AND si.specification_details_uid = sd.uid',
                        },
                    ),
                    RepoUtils.getStringAggJoin(
                        LibSurveyCertificateAuthority,
                        'Authority',
                        'aliased.active_status = 1',
                        'inspection',
                        {
                            entity: className(SpecificationInspectionEntity),
                            alias: 'si',
                            on: 'aliased.ID = si.LIB_Survey_CertificateAuthority_ID AND si.specification_details_uid = sd.uid',
                        },
                    ),
                ])
                .groupBy(
                    [
                        'sd.uid',
                        'sd.function_uid',
                        'sd.component_uid',
                        'sd.item_number',
                        'db.done_by',
                        'sd.active_status',
                        'msb.materialSuppliedBy',
                        'tm.Code',
                        'tm.Status',
                        'tm.title',
                        'sd.project_uid',
                        'sd.item_source_uid',
                        'its.display_name',
                    ].join(', '),
                )
                .where('sd.active_status = 1')
                .getSql();

            return oDataService.getJoinResult(query);
        } catch (error) {
            throw new Error(
                `Method: GetSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }

    public async CreateSpecificationDetails(data: ICreateSpecificationDetailsDto, queryRunner: QueryRunner) {
        data.CreatedAt = new Date();
        data.ActiveStatus = true;

        //TODO: think how to return uid from insert request, why it return undefined?
        data.uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(SpecificationDetailsEntity, data);
        return data.uid;
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
            select: ['functionUid', 'description', 'subject'],
            relations: ['subItems', 'inspection', 'doneBy', 'category', 'materialSuppliedBy'],
        });
        const standardJobsItemSource = await dictionariesRepository.getItemSourceByName(ItemName.StandardJob);

        const specifications = standardJobs.map((standardJob) => {
            const specification = new SpecificationDetailsEntity();
            specification.uid = new DataUtilService().newUid();
            specification.FunctionUid = standardJob.functionUid;
            specification.Description = standardJob.description;
            specification.Subject = standardJob.subject;
            specification.CreatedByUid = createdBy;
            specification.CreatedAt = new Date();
            specification.ActiveStatus = true;
            specification.MaterialSuppliedByUid = standardJob.materialSuppliedBy?.uid!;
            specification.DoneByUid = standardJob.doneBy?.uid!;
            specification.ItemCategoryUid = standardJob.category?.uid!;
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
            return specification;
        });

        await queryRunner.manager.insert(SpecificationDetailsEntity, specifications);

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

    public async UpdateSpecificationDetails(data: IUpdateSpecificationDetailsDto, queryRunner: QueryRunner) {
        delete data.Inspections;
        return queryRunner.manager.update(SpecificationDetailsEntity, data.uid, data);
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
            .where(`sd.uid = '${specificationUid}'`)
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
            .where(`sr.specificationUid = '${specificationUid}'`)
            .andWhere(`sr.requisitionUid IN ('${requisitionUid.join(`','`)}')`)
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
            .where(`specification_uid = '${specificationUid}'`)
            .andWhere(`requisition_uid = '${requisitionUid}'`)
            .execute();
    }

    public async TryGetSpecification(specificationUid: string): Promise<SpecificationDetailsEntity | undefined> {
        const jobOrdersRepository = getManager().getRepository(SpecificationDetailsEntity);

        const jobOrder = await jobOrdersRepository.findOne({
            where: {
                uid: specificationUid,
            },
        });

        return jobOrder;
    }
}
