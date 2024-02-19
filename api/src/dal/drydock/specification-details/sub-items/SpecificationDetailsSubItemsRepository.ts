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
    SpecificationDetailsSubItemEntity,
    SubItemCostFactorsExcerpt,
} from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { SpecificationSubItemFindingEntity } from '../../../../entity/drydock/SpecificationSubItemFindingEntity';
import { SpecificationSubItemPmsEntity } from '../../../../entity/drydock/SpecificationSubItemPmsJobEntity';
import { UnitTypeEntity } from '../../../../entity/drydock/UnitTypeEntity';
import { ODataResult } from '../../../../shared/interfaces';
import { CreateManyParams } from './dto/CreateManyParams';
import { CreateSubItemParams } from './dto/CreateSubItemParams';
import { DeleteManyParams } from './dto/DeleteManyParams';
import { DeleteSubItemParams } from './dto/DeleteSubItemParams';
import { FindSpecificationSubItemsDto } from './dto/FindSpecificationSubItemsDto';
import { GetManyParams } from './dto/GetManyParams';
import { GetSubItemParams } from './dto/GetSubItemParams';
import { UpdateSubItemParams } from './dto/UpdateSubItemParams';
import { ValidateFindingDeleteDto } from './dto/ValidateFindingDeleteDto';
import { ValidatePmsJobDeleteDto } from './dto/ValidatePmsJobDeleteDto';

export type FindManyRecord = Pick<
    SpecificationDetailsSubItemEntity,
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
    | 'estimatedCost'
>;

export class SpecificationDetailsSubItemsRepository {
    public async validateSubItemSpecAgainstProject(
        SubItemArray: Array<SpecificationDetailsSubItemEntity>,
        ProjectUid: string,
        queryRunner: QueryRunner,
    ) {
        const specUids = SubItemArray.map((item) => item.specificationDetails.uid);
        const dbValues = await queryRunner.manager
            .createQueryBuilder(className(SpecificationDetailsEntity), 'spec')
            .select('spec.uid as uid')
            .where(`spec.ActiveStatus = 1`)
            .andWhere(`spec.ProjectUid = :ProjectUid`, { ProjectUid })
            .andWhere(`spec.uid IN (:...specUids)`, { specUids })
            .execute();

        return SubItemArray.filter((item) => {
            const res = dbValues.find((val: any) => val.uid === item.specificationDetails.uid);
            return !!res;
        });
    }

    public async validateSubItemsAgainstProject(
        SubItemArray: Array<SpecificationDetailsSubItemEntity>,
        ProjectUid: string,
        queryRunner: QueryRunner,
    ) {
        const subItemUids = SubItemArray.map((item) => item.uid);
        const dbValues = await queryRunner.manager
            .createQueryBuilder(className(SpecificationDetailsSubItemEntity), 'item')
            .select('item.uid as uid')
            .innerJoin(
                className(SpecificationDetailsEntity),
                'spec',
                'item.specification_details_uid = spec.uid and spec.active_status = 1',
            )
            .where(`spec.ProjectUid = :ProjectUid`, { ProjectUid })
            .andWhere(`item.uid IN (:...subItemUids)`, { subItemUids })
            .execute();

        return SubItemArray.filter((item) => {
            const res = dbValues.find((val: any) => val.uid === item.uid);
            return !!res;
        });
    }

    public async findMany(params: FindSpecificationSubItemsDto): Promise<ODataResult<FindManyRecord>> {
        const [script, substitutions] = getManager()
            .createQueryBuilder(SpecificationDetailsSubItemEntity, 'subItem')
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
                'subItem.estimatedCost as estimatedCost',
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

    public async getBySpecificationDetailsUid(specificationDetailsUid: string[]) {
        if (specificationDetailsUid.length === 0) {
            return [];
        }

        return getManager().find(SpecificationDetailsSubItemEntity, {
            where: {
                specificationDetails: {
                    uid: In(specificationDetailsUid),
                },
                active_status: true,
            },
        });
    }

    public async getOneByUid(
        params: Pick<GetSubItemParams, 'uid' | 'specificationDetailsUid'>,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity | null> {
        const subItem = await queryRunner.manager.findOne(SpecificationDetailsSubItemEntity, {
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

    public async getOneExistingByUid(
        params: Pick<GetSubItemParams, 'uid' | 'specificationDetailsUid'>,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity> {
        const subItem = await this.getOneByUid(params, queryRunner);

        if (subItem == null) {
            throw new SpecificationDetailsSubItemNotFoundByUidError(params.uid, params.specificationDetailsUid);
        }

        return subItem;
    }

    public async createOne(
        params: CreateSubItemParams,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity> {
        await this.assertAllUnitTypesExistByUids([params.unitUid], queryRunner);

        const { createdBy: created_by, ...props } = params;

        const subItemData = this.mapSubItemDtoToEntity(props, {
            uid: DataUtilService.newUid(),
        });

        subItemData.created_by = created_by;
        subItemData.created_at = new Date();

        const subItem = queryRunner.manager.create(SpecificationDetailsSubItemEntity, subItemData);

        await queryRunner.manager.save(subItem);

        return subItemData;
    }

    public async createMany(
        params: CreateManyParams,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity[]> {
        const unitUids = params.subItems.map((props) => props.unitUid);

        await this.assertAllUnitTypesExistByUids(unitUids, queryRunner);

        const newSubItems = params.subItems.map((props): SpecificationDetailsSubItemEntity => {
            return queryRunner.manager.create(SpecificationDetailsSubItemEntity, {
                ...props,
                specificationDetailsUid: params.specificationDetailsUid,
                created_by: params.createdBy,
                created_at: new Date(),
            });
        });

        await queryRunner.manager.save(newSubItems);

        return newSubItems;
    }

    public async createRawSubItems(subItemsData: SpecificationDetailsSubItemEntity[], queryRunner: QueryRunner) {
        const newSubItems = subItemsData.map((data) =>
            queryRunner.manager.create(SpecificationDetailsSubItemEntity, data),
        );
        return queryRunner.manager.save(newSubItems);
    }

    public async updateMultipleEntities(subItemsData: SpecificationDetailsSubItemEntity[], queryRunner: QueryRunner) {
        const repository = queryRunner.manager.getRepository(SpecificationDetailsSubItemEntity);
        const promises = subItemsData.map((entity) => {
            return repository.update(
                {
                    uid: entity.uid,
                    active_status: true,
                },
                entity,
            );
        });
        await Promise.all(promises);
    }

    public async updateRawSubItem(subItemData: Partial<SpecificationDetailsSubItemEntity>, queryRunner: QueryRunner) {
        return queryRunner.manager.save(SpecificationDetailsSubItemEntity, subItemData);
    }

    public async updateOneExistingByUid(
        params: UpdateSubItemParams,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity> {
        const existingSubItem = await this.getOneExistingByUid(params, queryRunner);

        if (params.props?.unitUid != null) {
            await this.assertAllUnitTypesExistByUids([params.props.unitUid], queryRunner);
        }

        const subItemData = this.mapSubItemDtoToEntity(params.props, existingSubItem);

        // assigned separately for type safety
        subItemData.updated_by = params.updatedBy;
        subItemData.updated_at = new Date();

        const newSubItem = queryRunner.manager.create(SpecificationDetailsSubItemEntity, subItemData);

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
                className(SpecificationDetailsSubItemEntity),
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
            .getCount();

        // True if no sub-items are linked to the PMS job
        return !(pmsJobs > 0);
    }

    public async validateFindingDelete({ specificationUid, findingUid }: ValidateFindingDeleteDto) {
        const findings = await getManager()
            .createQueryBuilder(className(SpecificationSubItemFindingEntity), 'sub_item_finding')
            .innerJoin(
                className(SpecificationDetailsSubItemEntity),
                'sub_item',
                'sub_item.uid = sub_item_finding.specification_sub_item_uid and sub_item.active_status = 1',
            )
            .innerJoin(
                className(SpecificationDetailsEntity),
                'spec',
                'spec.uid = sub_item.specification_details_uid and spec.active_status = 1',
            )
            .select('count(sub_item_finding.uid) as count')
            .where(`sub_item_finding.finding_uid = :findingUid`, { findingUid })
            .andWhere(`spec.uid = :specificationUid`, { specificationUid })
            .andWhere('sub_item_finding.active_status = 1')
            .getCount();

        // True if no sub-items are linked to the PMS job
        return !(findings > 0);
    }

    protected async getManyByUids(
        params: GetManyParams,
        queryRunner: QueryRunner,
    ): Promise<SpecificationDetailsSubItemEntity[]> {
        return queryRunner.manager.find(SpecificationDetailsSubItemEntity, {
            where: {
                specificationDetailsUid: params.specificationDetailsUid,
                uid: In(params.uids),
                active_status: true,
            },
        });
    }

    protected async assertAllUnitTypesExistByUids(
        unitTypeUids: (string | undefined)[],
        queryRunner: QueryRunner,
    ): Promise<void> {
        const uids = unitTypeUids.filter((uid) => !!uid) as string[];
        if (uids.length === 0) {
            return;
        }
        const unitTypes = await queryRunner.manager.find(UnitTypeEntity, {
            where: {
                uid: In(uids),
                activeStatus: true,
            },
        });

        const unitTypeExistenceMap = calculateEntityExistenceMap(unitTypes, uids);

        for (const [unitTypeUid, exists] of entriesOf(unitTypeExistenceMap)) {
            if (!exists) {
                throw new UnitTypeNotFoundByUidError(unitTypeUid);
            }
        }
    }

    protected markAsDeleted(subItem: SpecificationDetailsSubItemEntity, deletedBy: string): void {
        subItem.active_status = false;
        subItem.deleted_by = deletedBy;
        subItem.deleted_at = new Date();
    }

    private mapSubItemDtoToEntity(
        subItemData: Partial<CreateSubItemParams>,
        subItem: Partial<SpecificationDetailsSubItemEntity>,
    ): SpecificationDetailsSubItemEntity {
        const newSubItemCostFactorsExcerpt: SubItemCostFactorsExcerpt = {
            quantity: subItemData.quantity ?? 0,
            unitPrice: subItemData.unitPrice ?? '0',
            discount: subItemData.discount ?? '0',
            estimatedCost: subItemData.estimatedCost ?? 0,
        };

        const newSubItem: Partial<SpecificationDetailsSubItemEntity> = {
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

        return newSubItem as SpecificationDetailsSubItemEntity;
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
