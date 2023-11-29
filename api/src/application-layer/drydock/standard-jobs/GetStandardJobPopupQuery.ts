import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ODataRequestDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { Query } from '../core/cqrs/Query';
import { GetStandardJobPopupDto } from './dto';

export class GetStandardJobPopupQuery extends Query<ODataRequestDto, ODataResult<GetStandardJobPopupDto>> {
    standardJobRepository = new StandardJobsRepository();

    protected async MainHandlerAsync(request: ODataRequestDto) {
        return this.standardJobRepository.getStandardJobsPopupData(request);
    }
}
