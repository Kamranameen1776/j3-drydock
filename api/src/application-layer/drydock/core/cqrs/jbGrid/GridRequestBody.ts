import { ODataBodyDto } from '../../../../../shared/dto';
import { GridFilter } from '../../../../../shared/interfaces/GridFilter';

export class GridRequestBody {
    public odata: ODataBodyDto;

    public gridFilters: GridFilter[];
}
