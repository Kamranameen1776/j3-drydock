import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';
import { RequestWithOData } from '../../../shared/interfaces';
import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    UpdateStandardJobsRequestDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';

export class StandardJobsRepository {
    private standardJobsService = new StandardJobsService();

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

    public async createStandardJob(
      data: CreateStandardJobsRequestDto,
      createdBy: string,
      queryRunner: QueryRunner
    ): Promise<any> {
        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        standardJob.created_by = createdBy;

        return queryRunner.manager.insert(standard_jobs, standardJob);
    }

    public async updateStandardJob(
      data: UpdateStandardJobsRequestDto,
      updatedBy: string,
      queryRunner: QueryRunner
    ): Promise<any> {
        const uid = data.uid;
        const standardJob = this.standardJobsService.mapStandardJobsDtoToEntity(data);
        const updateStandardJobData = this.standardJobsService.addUpdateStandardJobsFields(standardJob, updatedBy);

        return queryRunner.manager.update(standard_jobs, { uid, active_status: 1 }, updateStandardJobData);
    }

    public async deleteStandardJob(
      uid: string,
      deletedBy: string,
      queryRunner: QueryRunner
    ): Promise<any> {
        const updateStandardJobData = this.standardJobsService.addDeleteStandardJobsFields(deletedBy);

        return queryRunner.manager.update(standard_jobs, { uid, active_status: 1 }, updateStandardJobData);
    }
}
