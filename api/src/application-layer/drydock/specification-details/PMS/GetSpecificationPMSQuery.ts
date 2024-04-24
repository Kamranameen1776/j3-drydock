import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetSpecificationQueryDto } from '../dtos/GetSpecificationPMSRequestDto';

export class GetSpecificationPmsQuery extends Query<GetSpecificationQueryDto, Array<string>> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async ValidationHandlerAsync(request: GetSpecificationQueryDto): Promise<void> {
        await validateAgainstModel(GetSpecificationQueryDto, request);
    }

    protected async MainHandlerAsync(request: GetSpecificationQueryDto) {
        const pms = await this.specificationDetailsRepository.getSpecificationPMSJobs(request.uid);
        return pms.map((pmsEntity) => pmsEntity.PMSUid);
    }
}
