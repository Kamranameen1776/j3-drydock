import { ODataService } from 'j2utils';
import { getConnection, getManager, In, type QueryRunner } from 'typeorm';

import { BusinessException } from '../../../../bll/drydock/core/exceptions';
import {
    calculateEntityExistenceMap,
    type EntityExistenceMap,
} from '../../../../common/drydock/ts-helpers/calculate-entity-existence-map';
import { entriesOf } from '../../../../common/drydock/ts-helpers/entries-of';
import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { SpecificationDetailsSubItemEntity as SubItem } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { UnitTypeEntity } from '../../../../entity/drydock/UnitTypeEntity';
import { type ODataResult } from '../../../../shared/interfaces/odata-result.interface';
import { CreateManyParams } from './dto/CreateManyParams';
import { CreateOneParams } from './dto/CreateOneParams';
import { DeleteManyParams } from './dto/DeleteManyParams';
import { DeleteOneParams } from './dto/DeleteOneParams';
import { FindManyParams } from './dto/FindManyParams';
import { GetManyParams } from './dto/GetManyParams';
import { GetOneParams } from './dto/GetOneParams';
import { UpdateOneParams } from './dto/UpdateOneParams';

export class SpecificationDetailsSubItemsRepository {
    protected readonly itemNumberDelimiter: RegExp | string = '.';

    public async findMany(params: FindManyParams): Promise<ODataResult<SubItem>> {
        const [script, substitutions] = getManager()
            .createQueryBuilder(SubItem, 'subItem')
            .select([
                'subItem.uid',
                'subItem.itemNumber',
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

    /**
     * Construct a sub-item object without making any asynchronous calls.
     * The method is a safe wrapper over `queryRunner.manager.create(…)`.
     */
    protected constructSubItem(params: CreateOneParams, queryRunner: QueryRunner): SubItem {
        return queryRunner.manager.create(SubItem, {
            // FIXME: set default value for itemNumber in entity definition
            specificationDetailsUid: params.specificationDetailsUid,
            subject: params.subject,
            unitTypeUid: params.unitTypeUid,
            quantity: params.quantity,
            unitPrice: params.unitPrice,
            discount: params.discount,
            created_by: params.createdBy,
            created_at: new Date(),
        });
    }

    private calculateNextItemNumberIntegerBySubItem(subItem: SubItem | undefined): number {
        let currentMax: number;

        if (subItem == null) {
            currentMax = 0;
        } else {
            const [, itemNumberInteger] = subItem.itemNumber.split(this.itemNumberDelimiter);

            currentMax = parseInt(itemNumberInteger, 10);
        }

        return currentMax + 1;
    }

    public async test(queryRunner: QueryRunner): Promise<unknown> {
        const specificationDetailsUid = '9E3060D0-4D3F-4AA2-9708-AE0FA3217A3D';

        console.log('::', 'find spec');

        const specificationDetails = await queryRunner.manager.findOne(SpecificationDetailsEntity, {
            where: {
                uid: specificationDetailsUid,
            },
        });

        if (specificationDetails == null) {
            throw new Error(`Could not find specification details "${specificationDetailsUid}"`); // TODO: derive from BusinessException
        }

        console.log('::', 'find existing sub-item');

        // FIXME: Invalid column name 'item_number' (migration had not been performed)
        const subItemExisting = await queryRunner.manager.findOne(SubItem, {
            where: {
                specificationDetails,
            },
            order: {
                itemNumber: 'DESC',
            },
        });

        console.log('::', '\tfound existing sub-item:', subItemExisting?.uid);
        console.log('::', 'construct new sub-item');

        const subItemNew = this.constructSubItem(
            {
                specificationDetailsUid,
                createdBy: '1',
                subject: `Whatever subject ${Math.random()}`,
                discount: 0.2,
                quantity: 5,
                unitPrice: 3,
                unitTypeUid: '10D5827E-0DF2-46D4-9B7D-021C1DDFCFBE',
            },
            queryRunner.manager.queryRunner ?? queryRunner,
        );

        console.log('::', 'calculateNextItemNumberIntegerBySubItem');

        const nextItemNumberInteger = this.calculateNextItemNumberIntegerBySubItem(subItemExisting);

        console.log('::', '\tcalculated:', nextItemNumberInteger);
        console.log('::', 'assign itemNumber');

        // Using .assign(…) to bypass `readonly` constraint
        // Don't do this in other places
        Object.assign(subItemNew, {
            itemNumber: `${specificationDetails.ItemNumber}${this.itemNumberDelimiter}${nextItemNumberInteger}`,
        });

        console.log('::', '\tassigned:', subItemNew.itemNumber);
        console.log('::', 'save subItem');

        await queryRunner.manager.save(subItemNew);
        console.log('::', '\tsaved');

        return subItemNew;
    }

    protected async batchCreate(params: CreateManyParams, queryRunner: QueryRunner): Promise<SubItem[]> {
        const unitTypeUids = params.subItems.map((props) => props.unitTypeUid);

        await this.assertAllUnitTypesExistByUids(unitTypeUids, queryRunner);
        // FIXME: make sure specification details record exists as well

        const newSubItems = params.subItems.map(
            (props): SubItem => this.constructSubItem({ ...params, ...props }, queryRunner),
        );

        await queryRunner.manager.transaction('SERIALIZABLE', async (entityManager) => {
            // …

            await entityManager.save(newSubItems);
        });

        return newSubItems;
    }

    public createMany(params: CreateManyParams, queryRunner: QueryRunner): Promise<SubItem[]> {
        return this.batchCreate(params, queryRunner);
    }

    public async createOne(params: CreateOneParams, queryRunner: QueryRunner): Promise<SubItem> {
        const [subItem] = await this.batchCreate({ ...params, subItems: [params] }, queryRunner);

        return subItem;
    }

    public async updateOneExistingByUid(params: UpdateOneParams, queryRunner: QueryRunner): Promise<SubItem> {
        const subItem = await this.getOneExistingByUid(params, queryRunner);

        if (params.props.unitTypeUid != null) {
            await this.assertAllUnitTypesExistByUids([params.props.unitTypeUid], queryRunner);
        }

        Object.assign(subItem, params.props);

        // assigned separately for type safety
        subItem.updated_by = params.updatedBy;
        subItem.updated_at = new Date();

        await queryRunner.manager.save(subItem);

        return subItem;
    }

    protected markAsDeleted(subItem: SubItem, deletedBy: string): void {
        subItem.active_status = false;
        subItem.deleted_by = deletedBy;
        subItem.deleted_at = new Date();
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
