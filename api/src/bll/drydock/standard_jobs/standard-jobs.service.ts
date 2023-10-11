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
            const lowerCaseFunction = standardJob.function.toLowerCase().replace(' ', '_');
            return {
                ...standardJob,
                subject: {
                    innerHTML: `<span>${standardJob.subject}<br><span class="function-${lowerCaseFunction}">${standardJob.function}</span></span>`,
                    value: standardJob.subject,
                    cellStyle: '',
                    cellClass: `.function-${lowerCaseFunction} { color: '#7886A2'; font-size: 12px; font-weight: 400; }`,
                },
            };
        });
        return {
            ...standardJobs,
            records,
        };
    }
}
