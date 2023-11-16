import { StandardJobsSubItems } from '../../../../entity/standard_jobs_sub_items';

export type GetStandardJobSubItemsResultDto = Pick<
    StandardJobsSubItems,
    'uid' | 'code' | 'subject' | 'description' | 'standard_job_uid'
>;
