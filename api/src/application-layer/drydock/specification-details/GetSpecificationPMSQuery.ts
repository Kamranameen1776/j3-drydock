import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { GetSpecificationPmsRequestDto } from './dtos/GetSpecificationPMSRequestDto';

export class GetSpecificationPmsQuery extends Query<GetSpecificationPmsRequestDto, Array<string>> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async MainHandlerAsync(request: GetSpecificationPmsRequestDto) {
        const pms = await this.specificationDetailsRepository.getSpecificationPMSJobs(request.query.uid);
        return pms.map((pmsEntity) => pmsEntity.PMSUid);
    }
}
