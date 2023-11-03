import { standard_jobs_sub_items } from "../../../../entity/standard_jobs_sub_items";

export interface GetStandardJobSubItemsResultDto extends Pick<standard_jobs_sub_items, 'uid' | 'code' | 'number' | 'subject' | 'description' | 'standard_job_uid' > {
}
