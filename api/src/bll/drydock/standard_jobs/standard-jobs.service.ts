import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    GetStandardJobsResultDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import _ from 'lodash';

export class StandardJobsService {
    public mapStandardJobsDataToDto(standardJobs: GetStandardJobsQueryResult): GetStandardJobsResultDto {
        const records = standardJobs.records.map((standardJob) => {
            if (!standardJob.function || !standardJob.subject) {
                return standardJob;
            }
            return {
                ...standardJob,
                subject: {
                    innerHTML: `<p class="jb_grid_mainText">${standardJob.subject}</p><p class="jb_grid_subText">${standardJob.function}</p>`,
                    value: standardJob.subject,
                    cellStyle: '',
                },
            };
        });
        return {
            ...standardJobs,
            records,
        };
    }

    public mapStandardJobsDtoToEntity(data: CreateStandardJobsRequestDto): Partial<standard_jobs> {
        const standardJob = new standard_jobs();
        standardJob.subject = data.subject;
        standardJob.code = data.code;
        standardJob.category_uid = data.categoryUid;
        standardJob.function = data.function;
        standardJob.done_by_uid = data.doneByUid;
        standardJob.inspection = data.inspection;
        standardJob.material_supplied_by_uid = data.materialSuppliedByUid;
        standardJob.vessel_type_specific = data.vesselTypeSpecific;
        standardJob.description = data.description;
        standardJob.vessel_type_uid = data.vesselTypeUid;

        return _.omitBy(standardJob, _.isUndefined);
    }

    public addUpdateStandardJobsFields(data: Partial<standard_jobs>, updatedBy: string): Partial<standard_jobs> {
        return {
            ...data,
            updated_at: new Date(),
            updated_by: updatedBy,
        };
    }

    public addDeleteStandardJobsFields(deletedBy: string): Partial<standard_jobs> {
        return {
            active_status: false,
            deleted_at: new Date(),
            deleted_by: deletedBy,
        };
    }
}
