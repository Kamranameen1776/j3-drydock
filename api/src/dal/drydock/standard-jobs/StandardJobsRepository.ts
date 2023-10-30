import { ApiRequestService, DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, In, QueryRunner } from "typeorm";
import { RequestWithOData } from '../../../shared/interfaces';
import {
    CreateStandardJobsRequestDto,
    UpdateStandardJobsRequestDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';
import {
    StandardJobsFiltersAllowedKeys,
    StandardJobsFilterTablesMap,
    StandardJobsLibraryValuesMap,
} from '../../../application-layer/drydock/standard-jobs/dto/GetStandardJobsFiltersRequestDto';
import { FiltersDataResponse } from '../../../shared/interfaces/filters-data-response.interface';
import { UpdateStandardJobSubItemsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto/UpdateStandardJobSubItemsRequestDto';
import { standard_jobs_sub_items } from "../../../entity/standard_jobs_sub_items";

export class StandardJobsRepository {
    private standardJobsService = new StandardJobsService();

    public async getStandardJobs(data: RequestWithOData): Promise<standard_jobs[]> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
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
                'sj.uid as uid,' +
                    'sj.subject as subject,' +
                    'sj."function" as "function",' +
                    'sj.code as code,' +
                    'sj.category_uid as categoryUid,' +
                    'ic.display_name as category,' +
                    'sj.done_by_uid as doneByUid,' +
                    'db.displayName as doneBy,' +
                    'sj.vessel_type_specific as vesselTypeSpecific,' +
                    'sj.description as description,' +
                    'sj.active_status as activeStatus,' +
                    'sj.material_supplied_by_uid as materialSuppliedByUid,' +
                    'msb.display_name as materialSuppliedBy,' +
                    'lsca.Authority as inspection,' +
                    `vt.VesselTypes as vesselType,` +
                    `vt.ID as vesselTypeId,` +
                    `lsca.ID as inspectionId`,
            )
            .where('sj.active_status = 1')
            .getSql();

        const filteredData = await oDataService.getJoinResult(query);

        const uids = filteredData.records.map((item: any) => item.uid);

        return await getManager().find(standard_jobs, {
            where: {
                uid: uids,
            },
            relations: ['inspection', 'vessel_type', 'done_by', 'material_supplied_by', 'category', 'sub_items'],
        });
    }

    public async createStandardJob(
        data: CreateStandardJobsRequestDto,
        createdBy: string,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        standardJob.created_by = createdBy;
        standardJob.uid = new DataUtilService().newUid();

        const entity: standard_jobs = queryRunner.manager.create(standard_jobs, standardJob);

        return queryRunner.manager.save(standard_jobs, entity);
    }

    public async updateStandardJobSubItems(
        data: UpdateStandardJobSubItemsRequestDto,
        userUid: string,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const standardJobUid = data.uid;

        const standardJob = await queryRunner.manager.findOne(standard_jobs, {
            where: {
                uid: standardJobUid,
            },
            relations: ['sub_items'],
        });
        const newSubItems = data.subItems.map((item) => item.uid);
        const existingSubItems = standardJob?.sub_items.map((item) => item.uid) || [];
        const subItemsToDelete = existingSubItems.filter((item) => !newSubItems.includes(item));

        const subItems = this.standardJobsService.mapStandardJobSubItemsDtoToEntity(data.subItems, data.uid, userUid);
        const deleteData = this.standardJobsService.addDeleteStandardJobsFields(userUid);

        await queryRunner.manager.save(standard_jobs_sub_items, subItems);
        await queryRunner.manager.update(standard_jobs_sub_items, {
            uid: In(subItemsToDelete),
            active_status: 1,
        }, deleteData);
    }

    public async updateStandardJob(
        data: UpdateStandardJobsRequestDto,
        updatedBy: string,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const uid = data.uid;

        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        const updateStandardJobData = this.standardJobsService.addUpdateStandardJobsFields(standardJob, updatedBy);

        const entity: standard_jobs = queryRunner.manager.create(standard_jobs, updateStandardJobData);
        entity.uid = uid;

        await queryRunner.manager.save(standard_jobs, {
            uid,
            vessel_type: [],
            inspection: [],
        });

        return queryRunner.manager.save(standard_jobs, entity);
    }

    public async deleteStandardJob(uid: string, deletedBy: string, queryRunner: QueryRunner): Promise<any> {
        const updateStandardJobData = this.standardJobsService.addDeleteStandardJobsFields(deletedBy);

        return queryRunner.manager.update(standard_jobs, { uid, active_status: 1 }, updateStandardJobData);
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

            return libraryData.data?.records?.map((item: any) => {
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
                    return await getManager()
                        .createQueryBuilder(tableName, 'lsca')
                        .select(`DISTINCT lsca.ID as uid, lsca.Authority as displayName`)
                        .where('lsca.active_status = 1')
                        .getRawMany();
            }
        }

        return [];
    }
}
