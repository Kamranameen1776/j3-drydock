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
import { SpecificationDetailsSubItemEntity as SubItem } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
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

export class SpecificationDetailsSubItemsRepository {
    protected readonly itemNumberDelimiter: RegExp | string = '.';

    public async findMany(params: FindManyParams): Promise<ODataResult<SubItem>> {
        const [script, substitutions] = getManager()
            .createQueryBuilder(SubItem, 'subItem')
            .select([
                'subItem.uid as uid',
                'subItem.itemNumber as itemNumber',
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
        const [subItem] = await this.batchCreate({ ...params, subItems: [params] }, queryRunner);

        return subItem;
    }

    /**
     * Construct a sub-item object without making any asynchronous calls.
     * The method is a safe wrapper over `queryRunner.manager.create(…)`.
     */
    protected constructSubItem(params: CreateSubItemParams, queryRunner: QueryRunner): SubItem {
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
                description: '',
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

    /** @deprecated Use {@link createMany} instead */
    public async createRawSubItems(subItemsData: SubItem[], queryRunner: QueryRunner) {
        const newSubItems = subItemsData.map((data) => queryRunner.manager.create(SubItem, data));
        return queryRunner.manager.save(newSubItems);
    }

    public async updateOneExistingByUid(params: UpdateSubItemParams, queryRunner: QueryRunner): Promise<SubItem> {
        const existingSubItem = await this.getOneExistingByUid(params, queryRunner);

        if (params.props.unitTypeUid != null) {
            await this.assertAllUnitTypesExistByUids([params.props.unitTypeUid], queryRunner);
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

    // FIXME: extract into SpecificationSubItemPmsRepository
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

    // FIXME: extract into SpecificationSubItemPmsRepository
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

    // FIXME: extract into SpecificationSubItemPmsRepository
    public async deleteAllSubItemRelations(uid: string, queryRunner: QueryRunner) {
        await queryRunner.manager.update(SpecificationSubItemPmsEntity, { SubItemUid: uid }, { ActiveStatus: false });
        await queryRunner.manager.update(
            SpecificationSubItemFindingEntity,
            { SubItemUid: uid },
            { ActiveStatus: false },
        );
    }

    // FIXME: extract into SpecificationSubItemPmsRepository
    public deleteSubItemPmsJobs(subItemUid: string, pmsJobUid: string[], queryRunner: QueryRunner) {
        return queryRunner.manager.update(
            SpecificationSubItemPmsEntity,
            { SubItemUid: subItemUid, PmsJobUid: In(pmsJobUid) },
            { ActiveStatus: false },
        );
    }

    // FIXME: extract into SpecificationSubItemPmsRepository
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
            .where(`sub_item_pms.j3_pms_agg_job_uid = '${pmsJobUid}'`) // FIXME:
            .andWhere(`spec.uid = '${specificationUid}'`) // FIXME:
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

    protected async assertAllUnitTypesExistByUids(uids: string[], queryRunner: QueryRunner): Promise<void> {
        const unitTypeUids = uids.filter((uid) => uid != null);

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

    /** @deprecated Use {@link constructSubItem} instead */
    private mapSubItemDtoToEntity(subItemData: Partial<CreateSubItemParams>, subItem: Partial<SubItem>): SubItem {
        const newSubItem: Partial<SubItem> = {
            ...subItem,
            quantity: subItemData.quantity,
            unitPrice: subItemData.unitPrice,
            discount: subItemData.discount ? Number(subItemData.discount.toFixed(2)) : 0,
            subject: subItemData.subject,
            description: subItemData.description,
        };

        const specificationDetails = new SpecificationDetailsEntity();
        specificationDetails.uid = subItemData.specificationDetailsUid!;
        newSubItem.specificationDetails = specificationDetails;

        if (subItemData.unitTypeUid) {
            const unitType = new UnitTypeEntity();
            unitType.uid = subItemData.unitTypeUid;
            newSubItem.unitType = unitType;
        }

        return newSubItem as SubItem;
    }
}

export interface FindManyRecord {
    uid: string;
    number: number;
    subject: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    cost: string;
    specificationDetailsUid: string;
    unitTypeUid: string;
    description: string;
    unitType: string;
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
