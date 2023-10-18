import { GetStandardJobsQueryData } from "./GetStandardJobsResultDto";

export type GetStandardJobsFiltersRequestDto = {
  key: StandardJobsFiltersAllowedKeys;
}

export type StandardJobsFiltersAllowedKeys = keyof Pick<GetStandardJobsQueryData, 'subject' | 'inspection' | 'category'>;

export const AllowedStandardJobsFiltersKeys: StandardJobsFiltersAllowedKeys[] = ['subject', 'inspection', 'category'];
