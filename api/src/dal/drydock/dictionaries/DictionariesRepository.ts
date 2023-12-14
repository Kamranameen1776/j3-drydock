import { getManager } from 'typeorm';

import { LibItemSourceEntity, LibUserEntity } from '../../../entity/drydock';

export class DictionariesRepository {
    public async GetManagers(): Promise<LibUserEntity[]> {
        const libUserRepository = getManager().getRepository(LibUserEntity);

        return libUserRepository.find({
            where: {
                UserType: 'OFFICE USER',
                ActiveStatus: true,
            },
        });
    }

    public async GetItemSources(): Promise<LibItemSourceEntity[]> {
        const libItemSourceRepository = getManager().getRepository(LibItemSourceEntity);

        return libItemSourceRepository.find({
            where: {
                ActiveStatus: true,
            },
        });
    }
}
