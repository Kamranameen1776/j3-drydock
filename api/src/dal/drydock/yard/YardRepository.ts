import { CreateAndUpdateYardDto } from 'application-layer/drydock/yard/dtos/CreateAndUpdateYardDto';
import { getManager, QueryRunner } from 'typeorm';

import { YardEntity } from '../../../entity/YardEntity';
import { GetYardResultDto } from './dtos/GetYardResultDto';

export class YardRepository {
    public async findOneByYardUid(uid: string): Promise<GetYardResultDto[]> {
        const yardRepository = getManager().getRepository(YardEntity);

        return await yardRepository
            .createQueryBuilder('yard')
            .select(
                `yard.uid as uid, 
                yard.YardName as yardName,
                yard.YardLocation as yardLocation,
                yard.ExportStatus as exportStatus,
                yard.ImportStatus as importStatus,
                yard.ActiveStatus as activeStatus,
                yard.CreatedByUid as createdByUid,
                yard.CreatedAt as createdAt`,
            )
            .where(`yard.active_status = 1 and yard.uid='${uid}'`)
            .getRawMany();
    }

    public async CreateYard(data: CreateAndUpdateYardDto, queryRunner: QueryRunner) {
        const yard = new YardEntity();
        yard.CreatedAt = new Date();
        yard.ActiveStatus = true;
        const result = await queryRunner.manager.insert(YardEntity, yard);
        return result;
    }
}
