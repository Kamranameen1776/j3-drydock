import { Request } from 'express';

import { AuthorizationException } from '../../../bll/drydock/core/exceptions';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SlfAccessor } from '../../../external-services/drydock/SlfAccessor';
import { Query } from '../core/cqrs/Query';
import { GetSpecificationDetailsDto } from './dtos/GetSpecificationDetailsDto';

export class GetSpecificationDetailsQuery extends Query<Request, GetSpecificationDetailsDto> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    vesselsRepository: VesselsRepository;
    slfAccessor: SlfAccessor;

    constructor() {
        super();
        this.vesselsRepository = new VesselsRepository();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.slfAccessor = new SlfAccessor();
    }

    protected async AuthorizationHandlerAsync(request: Request): Promise<void> {
        const token: string = request.headers.authorization as string;

        const vessel = await this.vesselsRepository.GetVesselBySpecification(request.query.uid as string);
        const assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(token);

        if (!assignedVessels.includes(vessel.VesselId)) {
            throw new AuthorizationException(`You have no assignment on vessel: ${vessel.VesselName} `);
        }

        return;
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<GetSpecificationDetailsDto> {
        const specDetails = await this.specificationDetailsRepository.findOneBySpecificationUid(
            request.query.uid as string,
        );
        specDetails.Inspections = await this.specificationDetailsRepository.findSpecInspections(
            request.query.uid as string,
        );
        return specDetails;
    }
}
