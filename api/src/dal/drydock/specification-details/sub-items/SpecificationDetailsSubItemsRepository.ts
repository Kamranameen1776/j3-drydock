import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner } from 'typeorm';

import { BusinessException } from '../../../../bll/drydock/core/exceptions';
import {
    calculateEntityExistenceMap,
    EntityExistenceMap,
} from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { className } from '../../../../common/drydock/ts-helpers/className';
import { entriesOf } from '../../../../common/drydock/ts-helpers/entries-of';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import {
    calculateCost,
    SpecificationDetailsSubItemEntity as SubItem,
    type SubItemCostFactorsExcerpt,
} from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { SpecificationSubItemFindingEntity } from '../../../../entity/drydock/SpecificationSubItemFindingEntity';
import { SpecificationSubItemPmsEntity } from '../../../../entity/drydock/SpecificationSubItemPmsJobEntity';
import { UnitTypeEntity } from '../../../../entity/drydock/UnitTypeEntity';
import { ODataResult } from '../../../../shared/interfaces';
import { CreateManyParams } from './dto/CreateManyParams';
import { CreateSubItemParams } from './dto/CreateSubItemParams';
import { DeleteManyParams } from './dto/DeleteManyParams';
import { DeleteSubItemParams } from './dto/DeleteSubItemParams';
import { FindManyParams } from './dto/FindManyParams';
import { GetManyParams } from './dto/GetManyParams';
import { GetSubItemParams } from './dto/GetSubItemParams';
import { UpdateSubItemParams } from './dto/UpdateSubItemParams';
import { ValidatePmsJobDeleteDto } from './dto/ValidatePmsJobDeleteDto';

export type FindManyRecord = Pick<
    SubItem,
    | 'uid'
    | 'number'
    | 'subject'
    | 'quantity'
    | 'unitPrice'
    | 'discount'
    | 'cost'
    | 'specificationDetailsUid'
    | 'unitTypeUid'
    | 'description'
    | 'unitType'
>;

export class SpecificationDetailsSubItemsRepository {
    public async findMany(params: FindManyParams): Promise<ODataResult<FindManyRecord>> {
        const [script, substitutions] = getManager()
            .createQueryBuilder(SubItem, 'subItem')
            .select([
                'subItem.uid as uid',
                'subItem.number as number',
                'subItem.subject as subject',
                'subItem.quantity as quantity',
                'subItem.unitPrice as unitPrice',
                'subItem.discount as discount',
                'subItem.cost as cost',
                'subItem.specification_details_uid as specificationDetailsUid',
                'subItem.unit_type_uid as unitTypeUid',
                'subItem.description as description',
                'unitType.types as unitType',
            ])
            .leftJoin('lib_unit_type', 'unitType', 'unitType.uid = subItem.unit_type_uid')
            .where('specification_details_uid = :specificationDetailsUid', {
                specificationDetailsUid: params.specificationDetailsUid,
            })
            .andWhere('subItem.active_status = 1')
            .getQueryAndParameters();

        const odataService = new ODataService({ query: params.odata }, getConnection);
        return odataService.getJoinResult(script, substitutions);
    }

    public async getOneByUid(params: GetSubItemParams, queryRunner: QueryRunner): Promise<SubItem | null> {
        const subItem = await queryRunner.manager.findOne(SubItem, {
            where: {
                specificationDetails: {
                    uid: params.specificationDetailsUid,
                },
                uid: params.uid,
                active_status: true,
            },
        });

        return subItem ?? null;
    }

    public async getOneExistingByUid(params: GetSubItemParams, queryRunner: QueryRunner): Promise<SubItem> {
        const subItem = await this.getOneByUid(params, queryRunner);

        if (subItem == null) {
            throw new SpecificationDetailsSubItemNotFoundByUidError(params.uid, params.specificationDetailsUid);
        }

        return subItem;
    }

    public async createOne(params: CreateSubItemParams, queryRunner: QueryRunner): Promise<SubItem> {
        await this.assertAllUnitTypesExistByUids([params.unitUid], queryRunner);

        const { createdBy: created_by, ...props } = params;

        const subItemData = this.mapSubItemDtoToEntity(props, {
            uid: DataUtilService.newUid(),
        });

        subItemData.created_by = created_by;
        subItemData.created_at = new Date();

        const subItem = queryRunner.manager.create(SubItem, subItemData);

        await queryRunner.manager.save(subItem);

        return subItemData;
    }

    public async createMany(params: CreateManyParams, queryRunner: QueryRunner): Promise<SubItem[]> {
        const unitUids = params.subItems.map((props) => props.unitUid);

        await this.assertAllUnitTypesExistByUids(unitUids, queryRunner);

        const newSubItems = params.subItems.map((props): SubItem => {
            return queryRunner.manager.create(SubItem, {
                ...props,
                specificationDetailsUid: params.specificationDetailsUid,
                created_by: params.createdBy,
                created_at: new Date(),
            });
        });

        await queryRunner.manager.save(newSubItems);

        return newSubItems;
    }

    public async createRawSubItems(subItemsData: SubItem[], queryRunner: QueryRunner) {
        const newSubItems = subItemsData.map((data) => queryRunner.manager.create(SubItem, data));
        return queryRunner.manager.save(newSubItems);
    }

    public async updateOneExistingByUid(params: UpdateSubItemParams, queryRunner: QueryRunner): Promise<SubItem> {
        const existingSubItem = await this.getOneExistingByUid(params, queryRunner);

        if (params.props.unitUid != null) {
            await this.assertAllUnitTypesExistByUids([params.props.unitUid], queryRunner);
        }

        const subItemData = this.mapSubItemDtoToEntity(params.props, existingSubItem);

        // assigned separately for type safety
        subItemData.updated_by = params.updatedBy;
        subItemData.updated_at = new Date();

        const newSubItem = queryRunner.manager.create(SubItem, subItemData);

        await queryRunner.manager.save(newSubItem);

        return subItemData;
    }

    public async deleteOneExistingByUid(params: DeleteSubItemParams, queryRunner: QueryRunner): Promise<void> {
        const subItem = await this.getOneExistingByUid(params, queryRunner);

        this.markAsDeleted(subItem, params.deletedBy);

        await queryRunner.manager.save(subItem);
    }

    public async deleteManyByUids(
        params: DeleteManyParams,
        queryRunner: QueryRunner,
    ): Promise<Readonly<EntityExistenceMap>> {
        const subItemsToDelete = await this.getManyByUids(params, queryRunner);

        for (const subItem of subItemsToDelete) {
            this.markAsDeleted(subItem, params.deletedBy);
        }

        await queryRunner.manager.save(subItemsToDelete);

        return calculateEntityExistenceMap(subItemsToDelete, params.uids);
    }

    public addSubItemPmsJobs(subItemUid: string, pmsJobUids: string[], queryRunner: QueryRunner) {
        const subItemPmsJob: SpecificationSubItemPmsEntity[] = pmsJobUids.map((uid) => {
            return queryRunner.manager.create(SpecificationSubItemPmsEntity, {
                uid: DataUtilService.newUid(),
                SubItemUid: subItemUid,
                PmsJobUid: uid,
            });
        });

        return queryRunner.manager.save(SpecificationSubItemPmsEntity, subItemPmsJob);
    }

    public addSubItemFindings(subItemUid: string, findingUids: string[], queryRunner: QueryRunner) {
        const subItemPmsJob: SpecificationSubItemFindingEntity[] = findingUids.map((uid) => {
            return queryRunner.manager.create(SpecificationSubItemFindingEntity, {
                uid: DataUtilService.newUid(),
                SubItemUid: subItemUid,
                FindingUid: uid,
            });
        });

        return queryRunner.manager.save(SpecificationSubItemFindingEntity, subItemPmsJob);
    }

    public async deleteAllSubItemRelations(uid: string, queryRunner: QueryRunner) {
        await queryRunner.manager.update(SpecificationSubItemPmsEntity, { SubItemUid: uid }, { ActiveStatus: false });
        await queryRunner.manager.update(
            SpecificationSubItemFindingEntity,
            { SubItemUid: uid },
            { ActiveStatus: false },
        );
    }

    public deleteSubItemPmsJobs(subItemUid: string, pmsJobUid: string[], queryRunner: QueryRunner) {
        return queryRunner.manager.update(
            SpecificationSubItemPmsEntity,
            { SubItemUid: subItemUid, PmsJobUid: In(pmsJobUid) },
            { ActiveStatus: false },
        );
    }

    public deleteSubItemFindings(subItemUid: string, findingUid: string[], queryRunner: QueryRunner) {
        return queryRunner.manager.update(
            SpecificationSubItemFindingEntity,
            { SubItemUid: subItemUid, FindingUid: In(findingUid) },
            { ActiveStatus: false },
        );
    }

    public async validatePmsJobDelete({ specificationUid, pmsJobUid }: ValidatePmsJobDeleteDto) {
        const pmsJobs = await getManager()
            .createQueryBuilder(className(SpecificationSubItemPmsEntity), 'sub_item_pms')
            .innerJoin(
                className(SubItem),
                'sub_item',
                'sub_item.uid = sub_item_pms.specification_sub_item_uid and sub_item.active_status = 1',
            )
            .innerJoin(
                className(SpecificationDetailsEntity),
                'spec',
                'spec.uid = sub_item.specification_details_uid and spec.active_status = 1',
            )
            .select('count(sub_item_pms.uid) as count')
            .where(`sub_item_pms.j3_pms_agg_job_uid = :pmsJobUid`, { pmsJobUid })
            .andWhere(`spec.uid = :specificationUid`, { specificationUid })
            .andWhere('sub_item_pms.active_status = 1')
            .execute();

        return pmsJobs.count > 0;
    }

    protected async getManyByUids(params: GetManyParams, queryRunner: QueryRunner): Promise<SubItem[]> {
        return queryRunner.manager.find(SubItem, {
            where: {
                specificationDetailsUid: params.specificationDetailsUid,
                uid: In(params.uids),
                active_status: true,
            },
        });
    }

    protected async assertAllUnitTypesExistByUids(unitTypeUids: string[], queryRunner: QueryRunner): Promise<void> {
        unitTypeUids = unitTypeUids.filter((uid) => uid !== undefined);
        if (unitTypeUids.length === 0) {
            return;
        }
        const unitTypes = await queryRunner.manager.find(UnitTypeEntity, {
            where: {
                uid: In(unitTypeUids),
                activeStatus: true,
            },
        });

        const unitTypeExistenceMap = calculateEntityExistenceMap(unitTypes, unitTypeUids);

        for (const [unitTypeUid, exists] of entriesOf(unitTypeExistenceMap)) {
            if (!exists) {
                throw new UnitTypeNotFoundByUidError(unitTypeUid);
            }
        }
    }

    protected markAsDeleted(subItem: SubItem, deletedBy: string): void {
        subItem.active_status = false;
        subItem.deleted_by = deletedBy;
        subItem.deleted_at = new Date();
    }

    private mapSubItemDtoToEntity(subItemData: Partial<CreateSubItemParams>, subItem: Partial<SubItem>): SubItem {
        const newSubItemCostFactorsExcerpt: SubItemCostFactorsExcerpt = {
            quantity: subItemData.quantity ?? 0,
            unitPrice: subItemData.unitPrice ?? '0',
            discount: subItemData.discount ?? '0',
        };

        const newSubItem: Partial<SubItem> = {
            ...subItem,
            ...newSubItemCostFactorsExcerpt,
            cost: calculateCost(newSubItemCostFactorsExcerpt).toFixed(2),
            subject: subItemData.subject,
            description: subItemData.description,
        };

        const specificationDetails = new SpecificationDetailsEntity();
        specificationDetails.uid = subItemData.specificationDetailsUid!;
        newSubItem.specificationDetails = specificationDetails;

        if (subItemData.unitUid) {
            const unitType = new UnitTypeEntity();
            unitType.uid = subItemData.unitUid;
            newSubItem.unitType = unitType;
        }

        return newSubItem as SubItem;
    }
}

export class SpecificationDetailsSubItemNotFoundByUidError extends BusinessException {
    constructor(public readonly specificationDetailsUid: string, public readonly subItemUid: string) {
        super(
            `Could not find sub-item (uid="${subItemUid}") in the specification details (uid="${specificationDetailsUid}")`,
        );
    }
}

export class UnitTypeNotFoundByUidError extends BusinessException {
    constructor(public readonly unitTypeUid: string) {
        super(`Could not find unit "${unitTypeUid}"`);
    }
}
