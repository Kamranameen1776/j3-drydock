import {
    GetStandardJobsQueryResult,
    GetStandardJobsResultDto,
} from '../../../application-layer/drydock/standard-jobs';

export class StandardJobsService {
    mapStandardJobsDataToDto(standardJobs: GetStandardJobsQueryResult): GetStandardJobsResultDto {
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
}
