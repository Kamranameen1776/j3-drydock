import { Request } from 'express';

import { AuthorizationException } from '../../../bll/drydock/core/exceptions';
import { validateAgainstModel } from '../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SlfAccessor } from '../../../external-services/drydock/SlfAccessor';
import { Query } from '../core/cqrs/Query';
import { GetSpecificationByUidDto } from './dtos/GetSpecificationByUidDto';
import { GetSpecificationDetailsDto } from './dtos/GetSpecificationDetailsDto';

export class GetSpecificationDetailsQuery extends Query<GetSpecificationByUidDto, GetSpecificationDetailsDto> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    vesselsRepository: VesselsRepository;
    slfAccessor: SlfAccessor;

    constructor() {
        super();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.slfAccessor = new SlfAccessor();
    }

    protected async AuthorizationHandlerAsync(request: GetSpecificationByUidDto): Promise<void> {
        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.uid);
        const assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(request.token);

        if (!assignedVessels.includes(vessel.VesselId)) {
            throw new AuthorizationException(`You have no assignment on vessel: ${vessel.VesselName} `);
        }

        return;
    }

    protected async ValidationHandlerAsync(request: GetSpecificationByUidDto): Promise<void> {
        await validateAgainstModel(GetSpecificationByUidDto, request);
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: GetSpecificationByUidDto): Promise<GetSpecificationDetailsDto> {
        const specDetails = await this.specificationDetailsRepository.findOneBySpecificationUid(request.uid);
        specDetails.Inspections = await this.specificationDetailsRepository.findSpecInspections(request.uid);
        return specDetails;
    }
}
