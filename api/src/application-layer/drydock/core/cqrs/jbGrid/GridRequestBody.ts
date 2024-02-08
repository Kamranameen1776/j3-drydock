import { ODataBodyDto } from '../../../../../shared/dto';
import { GridFilter } from '../../../../../shared/interfaces/GridFilter';

export class GridRequestBody extends ODataBodyDto {
    public gridFilters: GridFilter[];
}
