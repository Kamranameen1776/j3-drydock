import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { LibUserEntity } from '../../../entity/drydock/dbo/LibUserEntity';
import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';
import { PriorityEntity } from '../../../entity/drydock/dbo/PriorityEntity';
import { TECTaskManagerEntity } from '../../../entity/drydock/dbo/TECTaskManagerEntity';
import { ProjectEntity } from '../../../entity/drydock/ProjectEntity';
import { SpecificationDetailsEntity } from '../../../entity/drydock/SpecificationDetailsEntity';
import { SpecificationInspectionEntity } from '../../../entity/drydock/SpecificationInspectionEntity';
import { LIB_Survey_CertificateAuthority } from '../../../entity/LIB_Survey_CertificateAuthority';
import { tm_dd_lib_done_by } from '../../../entity/tm_dd_lib_done_by';
import { tm_dd_lib_item_category } from '../../../entity/tm_dd_lib_item_category';
import { tm_dd_lib_material_supplied_by } from '../../../entity/tm_dd_lib_material_supplied_by';
import { ICreateSpecificationDetailsDto } from './dtos/ICreateSpecificationDetailsDto';
import { ISpecificationDetailsResultDto } from './dtos/ISpecificationDetailsResultDto';
import { IUpdateSpecificationDetailsDto } from './dtos/IUpdateSpecificationDetailsDto';

export class SpecificationDetailsRepository {
    public async findSpecInspections(uid: string): Promise<any> {
        const inspectionRepository = getManager().getRepository(SpecificationInspectionEntity);

        return await inspectionRepository
            .createQueryBuilder('insp')
            .select(['ca.ID as InspectionId', 'ca.Authority as InspectionText'])
            .innerJoin(className(LIB_Survey_CertificateAuthority), 'ca', 'insp.LIBSurveyCertificateAuthorityID = ca.ID')
            .where('insp.SpecificationDetailsUid = :uid', { uid })
            .execute();
    }

    public async findOneBySpecificationUid(uid: string): Promise<any> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);

        return await specificationRepository
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
            .innerJoin(className(TECTaskManagerEntity), 'tm', 'spec.TecTaskManagerUid = tm.uid')
            .innerJoin(className(tm_dd_lib_done_by), 'db', 'spec.DoneByUid = db.uid')
            .leftJoin(className(PriorityEntity), 'pr', 'spec.PriorityUid = pr.uid')
            .innerJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .innerJoin(className(LibVesselsEntity), 'ves', 'proj.VesselUid = ves.uid')
            .innerJoin(className(LibUserEntity), 'usr', 'proj.ProjectManagerUid = usr.uid')
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .execute();
    }

    public async GetManySpecificationDetails(
        data: Request,
    ): Promise<{ records: SpecificationDetailsEntity[]; count?: number }> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder('specification_details', 'sd')
                .leftJoin(className(tm_dd_lib_item_category), 'ic', 'sd.item_category_uid = ic.uid')
                .leftJoin(className(tm_dd_lib_done_by), 'db', 'sd.done_by_uid = db.uid')
                .leftJoin(className(tm_dd_lib_material_supplied_by), 'msb', 'sd.material_supplied_by_uid = msb.uid')
                .innerJoin(className(TECTaskManagerEntity), 'tm', 'sd.tec_task_manager_uid = tm.uid')
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

            return await oDataService.getJoinResult(query);
        } catch (error) {
            throw new Error(
                `Method: GetSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }

    public async CreateSpecificationDetails(data: ICreateSpecificationDetailsDto, queryRunner: QueryRunner) {
        // const spec = await this.CreateSpecificationDetailsEntity(data);
        data.CreatedAt = new Date();
        data.ActiveStatus = true;

        //TODO: think how to return uid from insert request, why it return undefined?
        data.uid = new DataUtilService().newUid();
        await queryRunner.manager.insert(SpecificationDetailsEntity, data);
        return data.uid;
    }

    public async CreateSpecificationInspection(data: any, queryRunner: QueryRunner) {
        return queryRunner.manager.insert(SpecificationInspectionEntity, data);
    }

    public async UpdateSpecificationInspection(
        data: Array<any>,
        SpecificationDetailsUid: string,
        queryRunner: QueryRunner,
    ) {
        console.log('inside');
        console.log(data);
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
        return await queryRunner.manager.update(SpecificationDetailsEntity, uid, spec);
    }
}
