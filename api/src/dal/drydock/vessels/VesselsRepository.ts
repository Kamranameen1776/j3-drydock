import { getManager } from 'typeorm';

import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';

export class VesselsRepository {
    public async GetVessel(vesselId: number): Promise<LibVesselsEntity> {
        const vesselRepository = getManager().getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                VesselId: vesselId,
            },
        });

        return data;
    }

    public async GetVesselByUID(vesselUID: string): Promise<LibVesselsEntity> {
        const vesselRepository = getManager().getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                uid: vesselUID,
            },
        });

        return data;
    }
}
