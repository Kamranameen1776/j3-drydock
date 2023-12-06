import { ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner } from 'typeorm';

import { BusinessException } from '../../../../bll/drydock/core/exceptions';
import {
    calculateEntityExistenceMap,
    EntityExistenceMap,
} from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { entriesOf } from '../../../../common/drydock/ts-helpers/entries-of';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { SpecificationDetailsSubItemEntity as SubItem } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { UnitTypeEntity } from '../../../../entity/drydock/UnitTypeEntity';
import { ODataResult } from '../../../../shared/interfaces';
import { CreateManyParams } from './dto/CreateManyParams';
import { CreateOneParams } from './dto/CreateOneParams';
import { DeleteManyParams } from './dto/DeleteManyParams';
import { DeleteOneParams } from './dto/DeleteOneParams';
import { FindManyParams } from './dto/FindManyParams';
import { GetManyParams } from './dto/GetManyParams';
import { GetOneParams } from './dto/GetOneParams';
import { UpdateOneParams } from './dto/UpdateOneParams';

export class SpecificationDetailsSubItemsRepository {
    public async findMany(params: FindManyParams): Promise<ODataResult<SubItem>> {
        const [script, substitutions] = getManager()
            .createQueryBuilder(SubItem, 'subItem')
            .select([
                'subItem.uid',
                'subItem.number',
                'subItem.subject',
                'subItem.quantity',
                'subItem.unitPrice',
                'subItem.discount',
                'subItem.cost',
                'subItem.specification_details_uid as specificationDetailsUid',
                'subItem.unit_type_uid as unitTypeUid',
            ])
            .where('specification_details_uid = :specificationDetailsUid', {
                specificationDetailsUid: params.specificationDetailsUid,
            })
            .andWhere('subItem.active_status = 1')
            .getQueryAndParameters();

        const odataService = new ODataService({ query: params.odata }, getConnection);
        const subItemsFound = await odataService.getJoinResult(script, substitutions);

        return subItemsFound;
    }

    public async getOneByUid(params: GetOneParams, queryRunner: QueryRunner): Promise<SubItem | null> {
        const subItem = await queryRunner.manager.findOne(SubItem, {
            where: {
                specificationDetailsUid: params.specificationDetailsUid,
                uid: params.uid,
                active_status: true,
            },
        });

        return subItem ?? null;
    }

    public async getOneExistingByUid(params: GetOneParams, queryRunner: QueryRunner): Promise<SubItem> {
        const subItem = await this.getOneByUid(params, queryRunner);

        if (subItem == null) {
            throw new SpecificationDetailsSubItemNotFoundByUidError(params.uid, params.specificationDetailsUid);
        }

        return subItem;
    }

    public async createOne(params: CreateOneParams, queryRunner: QueryRunner): Promise<SubItem> {
        await this.assertAllUnitTypesExistByUids([params.unitUid], queryRunner);

        const { createdBy: created_by, ...props } = params;

        const subItem = queryRunner.manager.create(SubItem, {
            ...props,
            created_by,
            created_at: new Date(),
        });

        await queryRunner.manager.save(subItem);

        return subItem;
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

    public async createRawSubItems(params: CreateManyParams, queryRunner: QueryRunner) {
        const subItems = params.subItems.map((prop): SubItem => {
            const item = new SubItem();
            item.subject = prop.subject;
            item.specificationDetails = {
                uid: params.specificationDetailsUid,
            } as SpecificationDetailsEntity;
            item.created_by = params.createdBy;
            item.created_at = new Date();
            item.quantity = 0;
            item.unitPrice = 0;
            item.discount = 0;
            // #TODO how to get unit type uid
            // item.unitType = {};

            return item;
        });

        return queryRunner.manager.save(SubItem, subItems);
    }

    public async updateOneExistingByUid(params: UpdateOneParams, queryRunner: QueryRunner): Promise<SubItem> {
        const subItem = await this.getOneExistingByUid(params, queryRunner);

        if (params.props.unitUid != null) {
            await this.assertAllUnitTypesExistByUids([params.props.unitUid], queryRunner);
        }

        Object.assign(subItem, params.props);

        // assigned separately for type safety
        subItem.updated_by = params.updatedBy;
        subItem.updated_at = new Date();

        await queryRunner.manager.save(subItem);

        return subItem;
    }

    public async deleteOneExistingByUid(params: DeleteOneParams, queryRunner: QueryRunner): Promise<void> {
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

        const deleted = calculateEntityExistenceMap(subItemsToDelete, params.uids);

        return deleted;
    }

    protected async getManyByUids(params: GetManyParams, queryRunner: QueryRunner): Promise<SubItem[]> {
        const subItems = await queryRunner.manager.find(SubItem, {
            where: {
                specificationDetailsUid: params.specificationDetailsUid,
                uid: In(params.uids),
                active_status: true,
            },
        });

        return subItems;
    }

    protected async assertAllUnitTypesExistByUids(unitTypeUids: string[], queryRunner: QueryRunner): Promise<void> {
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
