import { getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import {
    J3PrcCompanyRegistryEntity,
    LibVesselsEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    TecTaskManagerEntity,
    YardsProjectsEntity,
} from '../../../entity/drydock';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { UnitTypeEntity } from '../../../entity/drydock/UnitTypeEntity';
import { IInvoiceRawDataDto } from './dtos/InvoiceDataDto';
import { IYardsResultDto } from './dtos/IYardsResultDto';

export class YardsRepository {
    public async getYards(): Promise<IYardsResultDto[]> {
        const yardsRepository = getManager().getRepository(J3PrcCompanyRegistryEntity);

        return yardsRepository
            .createQueryBuilder('yd')
            .select(
                `yd.uid as uid,
                yd.registeredName as yardName,
                RTRIM(LTRIM(CONCAT("yd"."country", ' ', "yd"."city"))) as yardLocation`,
            )
            .where(`yd.active_status = 1 AND yd.type = 'Yard'`)
            .execute();
    }

    public async getInvoiceData(projectUid: string, yardUid: string): Promise<Array<IInvoiceRawDataDto>> {
        const repository = getManager().getRepository(ProjectEntity);
        return repository
            .createQueryBuilder('pr')
            .select([
                'spec.uid as SpecificationUid',
                'spec.Description as SpecificationDescription',
                'spec.ProjectUid as ProjectUid',
                'pr.StartDate as StartDate',
                'pr.EndDate as EndDate',
                'pr.Subject as Subject',
                'vessel.VesselName as VesselName',
                'vessel.ManagementCompany as ManagementCompany',
                'yard.registeredName as YardName',
                'yard.currencies as YardCurrencies',
                `spec.[function] as 'Function'`,
                'tm.Code as SpecificationCode',
                'spec.Subject as SpecificationSubject',
                'spec.ItemNumber as SpecificationNumber',
                'item.uid as ItemUid',
                'item.number as ItemNumber',
                `ut.types as ItemUOM`,
                'item.subject as ItemSubject',
                'item.quantity as ItemQTY',
                'item.unit_price as ItemUnitPrice',
                'item.discount as ItemDiscount',
                'item.yardComments as ItemComment',
                'item.description as ItemDescription',
            ])
            .innerJoin(className(LibVesselsEntity), 'vessel', 'pr.VesselUid = vessel.uid')
            .innerJoin(className(YardsProjectsEntity), 'yp', `yp.project_uid = pr.uid`)
            .innerJoin(
                className(J3PrcCompanyRegistryEntity),
                'yard',
                `yp.yard_uid = yard.uid and yard.uid = :yardUid`,
                { yardUid },
            )
            .leftJoin(
                className(SpecificationDetailsEntity),
                'spec',
                'spec.ProjectUid = pr.uid and spec.ActiveStatus = 1',
            )
            .leftJoin(className(TecTaskManagerEntity), 'tm', 'spec.TecTaskManagerUid = tm.uid')
            .leftJoin(
                className(SpecificationDetailsSubItemEntity),
                'item',
                'item.specification_details_uid = spec.uid and item.active_status=1',
            )
            .leftJoin(className(UnitTypeEntity), 'ut', 'ut.uid = item.unit_type_uid')
            .where(`pr.active_status = 1 AND pr.uid = :projectUid`, { projectUid })
            .execute();
    }
    public async getSubItemUnitTypes(queryRunner: QueryRunner) {
        const repository = queryRunner.manager.getRepository(UnitTypeEntity);
        return repository.find({
            where: {
                activeStatus: true,
            },
        });
    }
}
