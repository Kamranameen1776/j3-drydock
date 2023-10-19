import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
} from '../../../application-layer/drydock/standard-jobs';
import { standard_jobs } from '../../../entity/standard_jobs';
import { RequestWithOData } from '../../../shared/interfaces';

export class StandardJobsRepository {
    public async getStandardJobs(data: RequestWithOData): Promise<GetStandardJobsQueryResult> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
            .createQueryBuilder('standard_jobs', 'sj')
            .leftJoin('LIB_VESSELTYPES', 'vt', `vt.uid = sj.vessel_type_uid and vt.active_status = 1`)
            .select(
                'sj.uid as uid,' +
                    'sj.subject as subject,' +
                    'sj."function" as "function",' +
                    'sj.code as code,' +
                    'sj.category as category,' +
                    'sj.done_by as doneBy,' +
                    'sj.inspection as inspection,' +
                    'sj.material_supplied_by as materialSuppliedBy,' +
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async createStandardJob(data: CreateStandardJobsRequestDto, queryRunner: QueryRunner): Promise<any> {
        const standardJob = new standard_jobs();
        standardJob.subject = data.subject;
        standardJob.code = data.code;
        standardJob.category = data.category;
        standardJob.function = data.function;
        standardJob.done_by = data.doneBy;
        standardJob.inspection = data.inspection;
        standardJob.material_supplied_by = data.materialSuppliedBy;
        standardJob.vessel_type_specific = data.vesselTypeSpecific;
        standardJob.description = data.description;
        standardJob.vessel_type_uid = data.vesselTypeUid;

        const result = await queryRunner.manager.insert(standard_jobs, standardJob);

        return result;
    }
}
