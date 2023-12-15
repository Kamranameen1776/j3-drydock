import { StandardJobsSubItems } from '../../../../entity/drydock';

export type GetStandardJobSubItemsResultDto = Pick<
    StandardJobsSubItems,
    'uid' | 'code' | 'subject' | 'description' | 'standardJobUid'
>;
