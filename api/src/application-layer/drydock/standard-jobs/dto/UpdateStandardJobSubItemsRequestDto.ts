import { GetStandardJobSubItemsResultDto } from './GetStandardJobSubItemsResultDto';

export interface UpdateStandardJobSubItemsRequestDto {
    uid: string;

    subItems: GetStandardJobSubItemsResultDto[];

    UserUID: string;
}
