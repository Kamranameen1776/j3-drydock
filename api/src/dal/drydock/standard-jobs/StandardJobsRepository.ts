import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

import { GetStandardJobsResultDto } from '../../../application-layer/drydock/standard-jobs/GetStandardJobsResultDto';
import { RequestWithOData } from '../../../shared/interfaces/request-with-odata.interface';

export class StandardJobsRepository {
    public async getStandardJobs(data: RequestWithOData): Promise<GetStandardJobsResultDto> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
            .createQueryBuilder('standard_jobs', 'sj')
            .leftJoin('LIB_VESSELTYPES', 'vt', `vt.uid = sj.vessel_type_uid and vt.active_status = 1`)
            .select(
                'sj.uid as uid,' +
                    'sj.subject as subject,' +
                    'sj.code as code,' +
                    'sj.category as category,' +
                    'sj.due_date as dueDate,' +
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
}
