import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ODataResult } from '../../../shared/interfaces';
import { Query } from '../core/cqrs/Query';
import { GetStandardJobPopupDto, GetStandardJobPopupRequestDto } from './dto';

export class GetStandardJobPopupQuery extends Query<
    GetStandardJobPopupRequestDto,
    ODataResult<GetStandardJobPopupDto>
> {
    standardJobRepository = new StandardJobsRepository();

    protected async MainHandlerAsync(request: GetStandardJobPopupRequestDto) {
        return this.standardJobRepository.getStandardJobsPopupData(request);
    }
}
