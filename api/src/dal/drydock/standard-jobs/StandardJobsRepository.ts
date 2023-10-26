import { ApiRequestService, DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';
import { RequestWithOData } from '../../../shared/interfaces';
import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    UpdateStandardJobsRequestDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';
import {
    StandardJobsFiltersAllowedKeys,
    StandardJobsLibraryValuesMap,
} from '../../../application-layer/drydock/standard-jobs/dto/GetStandardJobsFiltersRequestDto';
import { FiltersDataResponse } from '../../../shared/interfaces/filters-data-response.interface';

export class StandardJobsRepository {
    private standardJobsService = new StandardJobsService();

    public async getStandardJobs(data: RequestWithOData): Promise<GetStandardJobsQueryResult> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
            .createQueryBuilder('standard_jobs', 'sj')
            .leftJoin('standard_jobs_vessel_type', 'sjvt', `sjvt.standard_job_uid = sj.uid`)
            .leftJoin('LIB_VESSELTYPES', 'vt', `vt.ID = sjvt.vessel_type_id and vt.active_status = 1`)
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
                    'sj.inspection as inspection,' +
                    'sj.material_supplied_by_uid as materialSuppliedByUid,' +
                    'msb.display_name as materialSuppliedBy,' +
                    'sj.vessel_type_specific as vesselTypeSpecific,' +
                    'sj.description as description,' +
                    'sj.active_status as activeStatus,' +
                    'vt.ID as vesselTypeId,' +
                    'vt.VesselTypes as vesselType',
            )
            .where('sj.active_status = 1')
            .getSql();

        return oDataService.getJoinResult(query);
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

        const filterData = await getManager()
            .createQueryBuilder('standard_jobs', 'sj')
            .select(`DISTINCT sj.${filterKey} as ${filterKey}`)
            .where('sj.active_status = 1')
            .getRawMany();

        return filterData
            .filter((item) => !!item[filterKey])
            .map((item) => {
                return {
                    displayName: item[filterKey],
                    uid: item[filterKey],
                } as FiltersDataResponse;
            });
    }
}
