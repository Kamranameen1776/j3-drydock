import { GetStandardJobsQueryData } from './GetStandardJobsResultDto';

export interface CreateStandardJobsRequestDto
    extends Omit<GetStandardJobsQueryData, 'vesselType' | 'vesselTypeId' | 'activeStatus' | 'uid'> {
    vesselTypeUid: string;
}
