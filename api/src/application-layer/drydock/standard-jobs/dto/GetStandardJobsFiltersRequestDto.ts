import { GetStandardJobsQueryData } from './GetStandardJobsResultDto';

export type StandardJobsFiltersAllowedKeys = keyof Pick<
    GetStandardJobsQueryData,
    'inspection' | 'category' | 'doneBy' | 'materialSuppliedBy'
>;

export const AllowedStandardJobsFiltersKeys: StandardJobsFiltersAllowedKeys[] = [
    'inspection',
    'category',
    'materialSuppliedBy',
    'doneBy',
];

export const StandardJobsLibraryValuesMap: { [key in StandardJobsFiltersAllowedKeys]?: string } = {
    category: 'ddItemCategory',
    doneBy: 'ddDoneBy',
    materialSuppliedBy: 'materialSuppliedBy',
};
