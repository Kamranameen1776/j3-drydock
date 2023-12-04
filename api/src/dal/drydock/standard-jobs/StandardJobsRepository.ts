import { ApiRequestService, DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner, UpdateResult } from 'typeorm';

import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    StandardJobsFiltersAllowedKeys,
    StandardJobsFilterTablesMap,
    StandardJobsLibraryValuesMap,
    UpdateStandardJobsRequestDto,
    UpdateStandardJobSubItemsRequestDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';
import { className } from '../../../common/drydock/ts-helpers/className';
import {
    LibVesseltypes,
    ProjectEntity,
    StandardJobs,
    StandardJobsSubItems,
    StandardJobsSurveyCertificateAuthorityEntity,
    StandardJobsVesselTypeEntity,
} from '../../../entity/drydock';
import { QueryStrings } from '../../../shared/enum/queryStrings.enum';
import { FiltersDataResponse, ODataResult, RequestWithOData } from '../../../shared/interfaces';

export class StandardJobsRepository {
    private standardJobsService = new StandardJobsService();

    public async getStandardJobs(data: RequestWithOData): Promise<GetStandardJobsQueryResult> {
        const oDataService = new ODataService(data, getConnection);

        const innerQuery = getManager()
            .createQueryBuilder('standard_jobs', 'sj')
            .leftJoin('standard_jobs_vessel_type', 'sjvt', `sjvt.standard_job_uid = sj.uid`)
            .leftJoin('standard_jobs_survey_certificate_authority', 'sjsca', `sjsca.standard_job_uid = sj.uid`)
            .leftJoin('LIB_Survey_CertificateAuthority', 'lsca', `lsca.ID = sjsca.survey_id and lsca.Active_Status = 1`)
            .leftJoin('LIB_VESSELTYPES', 'vt', `vt.ID = sjvt.vessel_type_id and vt.Active_Status = 1`)
            .leftJoin('tm_dd_lib_done_by', 'db', `db.uid = sj.done_by_uid AND db.active_status = 1`)
            .leftJoin('tm_dd_lib_item_category', 'ic', `ic.uid = sj.category_uid AND ic.active_status = 1`)
            .leftJoin(
                'tm_dd_lib_material_supplied_by',
                'msb',
                `msb.uid = sj.material_supplied_by_uid AND msb.active_status = 1`,
            )
            .select(
                'distinct sj.uid as uid,' +
                    'sj.subject as subject,' +
                    'sj.scope as scope,' +
                    'sj."function" as "function",' +
                    'sj."function_uid" as "functionUid",' +
                    'CONCAT(sj.code, sj.number) as code,' +
                    'sj.category_uid as categoryUid,' +
                    'ic.display_name as category,' +
                    'sj.done_by_uid as doneByUid,' +
                    'db.displayName as doneBy,' +
                    'sj.vessel_type_specific as vesselTypeSpecific,' +
                    'sj.description as description,' +
                    'sj.active_status as activeStatus,' +
                    'sj.material_supplied_by_uid as materialSuppliedByUid,' +
                    'msb.display_name as materialSuppliedBy,' +
                    //TODO: temporary dummy values for monday qc. fix it
                    `'RandomIds' as inspectionId` +
                    `'RandomInspections' as inspection` +
                    `'RandomVesselIds' as vesselTypeId` +
                    `'RandomVesselType' as vesselType`,
                // `STRING_AGG(lsca.ID, ',') as inspectionId,` +
                // `STRING_AGG(lsca.Authority, ',') as inspection`,
                // `STRING_AGG(vt.ID, ',') as vesselTypeId,` +
                // `STRING_AGG(vt.VesselTypes, ',') as vesselType,` +
            )
            .groupBy(
                `sj.uid` +
                    `,sj.subject` +
                    `,sj.scope` +
                    `,sj."function"` +
                    ',sj."function_uid"' +
                    `,sj.code` +
                    `,sj.number` +
                    `,sj.category_uid` +
                    `,ic.display_name` +
                    `,sj.done_by_uid` +
                    `,db.displayName` +
                    `,sj.vessel_type_specific` +
                    `,sj.description` +
                    `,sj.active_status` +
                    `,sj.material_supplied_by_uid` +
                    `,msb.display_name`,
            )
            .where('sj.active_status = 1')
            .getSql();

        return oDataService.getJoinResult(innerQuery);
    }

    public async createStandardJob(
        data: CreateStandardJobsRequestDto,
        createdBy: string,
        queryRunner: QueryRunner,
    ): Promise<StandardJobs> {
        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        standardJob.created_by = createdBy;
        standardJob.uid = new DataUtilService().newUid();

        const entity: StandardJobs = queryRunner.manager.create(StandardJobs, standardJob);

        const result = await queryRunner.manager.save(StandardJobs, entity);

        await this.updateStandardJobRelations(result.uid, data.inspectionId, data.vesselTypeId, queryRunner);

        return result;
    }

    public async updateStandardJobSubItems(
        data: UpdateStandardJobSubItemsRequestDto,
        userUid: string,
        queryRunner: QueryRunner,
    ): Promise<void> {
        const standardJobUid = data.uid;

        const standardJob = await queryRunner.manager.findOne(StandardJobs, {
            where: {
                uid: standardJobUid,
            },
            relations: ['subItems'],
        });
        const newSubItems = data.subItems.map((item) => item.uid);
        const existingSubItems = standardJob?.subItems.map((item) => item.uid) || [];
        const subItemsToDelete = existingSubItems.filter((item) => !newSubItems.includes(item));

        const subItems = this.standardJobsService.mapStandardJobSubItemsDtoToEntity(data.subItems, data.uid, userUid);
        const deleteData = this.standardJobsService.addDeleteStandardJobsFields(userUid);

        await queryRunner.manager.save(StandardJobsSubItems, subItems);
        if (subItemsToDelete.length > 0) {
            await queryRunner.manager.update(
                StandardJobsSubItems,
                {
                    uid: In(subItemsToDelete),
                    active_status: 1,
                },
                deleteData,
            );
        }
    }

    public async updateStandardJob(
        data: UpdateStandardJobsRequestDto,
        updatedBy: string,
        queryRunner: QueryRunner,
    ): Promise<StandardJobs> {
        const uid = data.uid;

        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        const updateStandardJobData = this.standardJobsService.addUpdateStandardJobsFields(standardJob, updatedBy);

        const entity: StandardJobs = queryRunner.manager.create(StandardJobs, updateStandardJobData);
        entity.uid = uid;

        const result = await queryRunner.manager.save(StandardJobs, entity);

        await this.updateStandardJobRelations(result.uid, data.inspectionId, data.vesselTypeId, queryRunner);

        return result;
    }

    public async deleteStandardJob(uid: string, deletedBy: string, queryRunner: QueryRunner): Promise<UpdateResult> {
        const updateStandardJobData = this.standardJobsService.addDeleteStandardJobsFields(deletedBy);

        return queryRunner.manager.update(StandardJobs, { uid, active_status: 1 }, updateStandardJobData);
    }

    public async getStandardJobFilters(
        filterKey: StandardJobsFiltersAllowedKeys,
        token: string,
    ): Promise<FiltersDataResponse[]> {
        const libraryCode = StandardJobsLibraryValuesMap[filterKey];
        if (libraryCode) {
            const apiPath = `library/get-library-data-by-code?libraryCode=${libraryCode}`;
            const libraryData = await new ApiRequestService().master(token, apiPath, 'post', {
                odata: { $filter: 'active_status=1' },
            });

            return libraryData.data?.records?.map((item: Record<string, string>) => {
                return {
                    displayName: item.display_name || item.displayName,
                    uid: item.uid,
                } as FiltersDataResponse;
            });
        }

        const tableName = StandardJobsFilterTablesMap[filterKey];
        if (tableName) {
            switch (filterKey) {
                case 'inspection':
                    return getManager()
                        .createQueryBuilder(tableName, 'lsca')
                        .select(`DISTINCT lsca.ID as uid, lsca.Authority as displayName`)
                        .where('lsca.active_status = 1')
                        .getRawMany();
            }
        }

        return [];
    }

    public getStandardJobSubItems(uids: string[]): Promise<StandardJobsSubItems[]> {
        const uidString = uids.map((uid) => `'${uid}'`).join(',');
        return getManager()
            .createQueryBuilder(StandardJobsSubItems, 'sub_items')
            .select(
                'sub_items.uid as uid,' +
                    'CONCAT(sub_items.code, sub_items.number) as code,' +
                    'sub_items.subject as subject,' +
                    'sub_items.description as description,' +
                    'sub_items.standard_job_uid as standardJobUid',
            )
            .where('sub_items.active_status = 1')
            .andWhere(`sub_items.standard_job_uid IN (${uidString})`)
            .getRawMany();
    }

    private async updateStandardJobRelations(
        standardJobUid: string,
        inspectionIds: number[],
        vesselTypeIds: number[],
        queryRunner: QueryRunner,
    ) {
        const relations = await queryRunner.manager.findOne(StandardJobs, {
            where: {
                uid: standardJobUid,
            },
            relations: ['inspection', 'vesselType'],
        });

        if (inspectionIds && inspectionIds.length) {
            const inspectionsToDelete =
                relations?.inspection.filter((item) => !inspectionIds.includes(item.ID as number)).map((i) => i.ID) ||
                [];
            const inspectionsToAdd = inspectionIds.filter(
                (item) => !relations?.inspection.map((i) => i.ID).includes(item),
            );

            if (inspectionsToDelete.length) {
                await queryRunner.manager.delete(StandardJobsSurveyCertificateAuthorityEntity, {
                    standard_job_uid: standardJobUid,
                    survey_id: In(inspectionsToDelete),
                });
            }
            if (inspectionsToAdd.length) {
                const inspections = inspectionsToAdd.map((id) => {
                    const inspection = new StandardJobsSurveyCertificateAuthorityEntity();
                    inspection.survey_id = id;
                    inspection.standard_job_uid = standardJobUid;

                    return inspection;
                });

                await queryRunner.manager.save(StandardJobsSurveyCertificateAuthorityEntity, inspections);
            }
        }
        if (vesselTypeIds && vesselTypeIds.length) {
            const vesselTypesToDelete =
                relations?.vesselType.filter((item) => !vesselTypeIds.includes(item.ID as number)).map((i) => i.ID) ||
                [];
            const vesselTypesToAdd = vesselTypeIds.filter(
                (item) => !relations?.vesselType.map((i) => i.ID).includes(item),
            );

            if (vesselTypesToDelete.length) {
                await queryRunner.manager.delete(StandardJobsVesselTypeEntity, {
                    standard_job_uid: standardJobUid,
                    vessel_type_id: In(vesselTypesToDelete),
                });
            }
            if (vesselTypesToAdd.length) {
                const vesselTypes = vesselTypesToAdd.map((id) => {
                    const vesselType = new StandardJobsVesselTypeEntity();
                    vesselType.vessel_type_id = id;
                    vesselType.standard_job_uid = standardJobUid;

                    return vesselType;
                });

                await queryRunner.manager.save(StandardJobsVesselTypeEntity, vesselTypes);
            }
        }
    }
}
