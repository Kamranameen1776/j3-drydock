import { GetStandardJobsQueryData } from './GetStandardJobsResultDto';

export type StandardJobsFiltersAllowedKeys = keyof Pick<
    GetStandardJobsQueryData,
    'inspection' | 'category' | 'doneBy' | 'materialSuppliedBy'
>;

export interface StandardJobsFiltersAllowedKeysRequestDto {
    key: StandardJobsFiltersAllowedKeys;

    token: string;
}

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

export const StandardJobsFilterTablesMap: { [key in StandardJobsFiltersAllowedKeys]?: string } = {
    inspection: 'LIB_Survey_CertificateAuthority',
};
