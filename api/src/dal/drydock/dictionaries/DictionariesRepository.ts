import { getManager } from 'typeorm';

import { LibUserEntity } from '../../../entity/drydock';

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
}
