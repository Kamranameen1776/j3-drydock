import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { DeleteSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationRequisitionsRequestDto';
import { GetRequisitionsResponseDto } from '../../../application-layer/drydock/specification-details/dtos/GetRequisitionsResponseDto';
import { GetSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto';
import { LinkSpecificationRequisitionsRequestDto } from '../../../application-layer/drydock/specification-details/dtos/LinkSpecificationRequisitionsRequestDto';
import { className } from '../../../common/drydock/ts-helpers/className';
import {
    J3PrcRequisition,
    LibSurveyCertificateAuthority,
    LibUserEntity,
    LibVesselsEntity,
    PriorityEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    SpecificationInspectionEntity,
    SpecificationRequisitionsEntity,
    TecTaskManagerEntity,
    TmDdLibDoneBy,
    TmDdLibItemCategory,
    TmDdLibMaterialSuppliedBy,
} from '../../../entity/drydock';
import { ODataResult } from '../../../shared/interfaces';
import {
    CreateInspectionsDto,
    ICreateSpecificationDetailsDto,
    InspectionsResultDto,
    IUpdateSpecificationDetailsDto,
    SpecificationDetailsResultDto,
} from './dtos';

export class SpecificationDetailsRepository {
    public async findSpecInspections(uid: string): Promise<Array<InspectionsResultDto>> {
        const inspectionRepository = getManager().getRepository(SpecificationInspectionEntity);

        return inspectionRepository
            .createQueryBuilder('insp')
            .select(['ca.ID as InspectionId', 'ca.Authority as InspectionText'])
            .innerJoin(className(LibSurveyCertificateAuthority), 'ca', 'insp.LIBSurveyCertificateAuthorityID = ca.ID')
            .where('insp.SpecificationDetailsUid = :uid', { uid })
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
                'tm.Status as Status',
                'spec.FunctionUid as FunctionUid',
                'spec.AccountCode as AccountCode',

                //TODO: clarify where it's from
                'spec.ItemSourceUid as ItemSourceUid',
                `'PMS' as ItemSourceText`,

                'spec.ItemNumber as ItemNumber',

                'spec.DoneByUid as DoneByUid',
                'db.displayName as DoneByDisplayName',

                'spec.EquipmentDescription as EquipmentDescription',
                'spec.Description as Description',

                'spec.PriorityUid as PriorityUid',
                `pr.DisplayName as PriorityName`,

                'ves.VesselName AS VesselName',
                'ves.uid AS VesselUid',
                `usr.FirstName + ' ' + usr.LastName AS ProjectManager`,
                'usr.uid AS ProjectManagerUid',
            ])
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'spec.TecTaskManagerUid = tm.uid')
            .leftJoin(className(TmDdLibDoneBy), 'db', 'spec.DoneByUid = db.uid')
            .leftJoin(className(PriorityEntity), 'pr', 'spec.PriorityUid = pr.uid')
            .leftJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .leftJoin(className(LibVesselsEntity), 'ves', 'proj.VesselUid = ves.uid')
            .leftJoin(className(LibUserEntity), 'usr', 'proj.ProjectManagerUid = usr.uid')
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .getRawOne();
    }

    public async GetManySpecificationDetails(
        data: Request,
    ): Promise<{ records: SpecificationDetailsEntity[]; count?: number }> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder('specification_details', 'sd')
                .leftJoin(className(TmDdLibItemCategory), 'ic', 'sd.item_category_uid = ic.uid')
                .leftJoin(className(TmDdLibDoneBy), 'db', 'sd.done_by_uid = db.uid')
                .leftJoin(className(TmDdLibMaterialSuppliedBy), 'msb', 'sd.material_supplied_by_uid = msb.uid')
                .innerJoin(className(TecTaskManagerEntity), 'tm', 'sd.tec_task_manager_uid = tm.uid')
                .select([
                    'sd.uid as uid',
                    'sd.function_uid',
                    'sd.component_uid',
                    'sd.item_number',
                    'db.done_by',
                    'ic.item_category',
                    'sd.active_status',
                    'msb.materialSuppliedBy',
                    'tm.Code as code',
                    'tm.Status as status',
                    'tm.title as subject',
                ])
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

    public async CreateSpecificationInspection(data: Array<CreateInspectionsDto>, queryRunner: QueryRunner) {
        return queryRunner.manager.insert(SpecificationInspectionEntity, data);
    }

    public async UpdateSpecificationInspection(
        data: Array<CreateInspectionsDto>,
        SpecificationDetailsUid: string,
        queryRunner: QueryRunner,
    ) {
        await queryRunner.manager.delete(SpecificationInspectionEntity, { SpecificationDetailsUid });
        return this.CreateSpecificationInspection(data, queryRunner);
    }

    public async UpdateSpecificationDetails(data: IUpdateSpecificationDetailsDto, queryRunner: QueryRunner) {
        delete data.Inspections;
        return queryRunner.manager.update(SpecificationDetailsEntity, data.uid, data);
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
            .innerJoin('specification_requisitions', 'sr', 'sr.requisition_uid = rq.uid')
            .innerJoin('specification_details', 'sd', 'sr.specification_uid = sd.uid AND sd.active_status = 1')
            .leftJoin('Lib_Ports', 'port', 'rq.delivery_port_id = port.PORT_ID')
            .leftJoin('lib_urgency', 'urg', 'urg.uid = rq.urgency_uid')
            .leftJoin('j3_prc_po', 'po', 'rq.uid = po.requisition_uid')
            .leftJoin('j3_prc_rfq', 'rfq', 'rq.uid = rfq.requisition_uid')
            .leftJoin('j3_prc_company_registry', 'cr', 'rfq.supplier_uid = cr.uid')
            .innerJoin('j3_prc_task_status', 'ts', 'rq.uid = ts.objectUid')
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
            ])
            .where(`sd.uid = '${specificationUid}'`)
            .getSql();

        return oDataService.getJoinResult(query);
    }

    public linkSpecificationRequisitions(
        data: LinkSpecificationRequisitionsRequestDto,
        queryRunner: QueryRunner,
    ): Promise<SpecificationRequisitionsEntity[]> {
        const specificationUid = data.specificationUid;
        const requisitionUid = data.requisitionUid;

        const entities = requisitionUid.map((uid) => {
            const specificationRequisition = new SpecificationRequisitionsEntity();
            specificationRequisition.specificationUid = specificationUid;
            specificationRequisition.requisitionUid = uid;
            return specificationRequisition;
        });

        return queryRunner.manager.save(SpecificationRequisitionsEntity, entities);
    }

    public async deleteSpecificationRequisitions(
        data: DeleteSpecificationRequisitionsRequestDto,
        queryRunner: QueryRunner,
    ): Promise<void> {
        const specificationUid = data.specificationUid;
        const requisitionUid = data.requisitionUid;

        await queryRunner.manager
            .createQueryBuilder(SpecificationRequisitionsEntity, 'sr')
            .delete()
            .where(`specification_uid = '${specificationUid}'`)
            .andWhere(`requisition_uid = '${requisitionUid}'`)
            .execute();
    }
}
