import { CreateAndUpdateYardSelectionDto } from 'application-layer/drydock/yard-selection/dtos/CreateAndUpdateYardSelectionDto';
import { getManager, QueryRunner } from 'typeorm';

import { YardSelectionEntity } from '../../../entity/YardSelectionEntity';
import { GetYardSelectionResultDto } from './dtos/GetYardSelectionResultDto';

export class YardSelectionRepository {
    public async findOneByYardUid(uid: string): Promise<GetYardSelectionResultDto[]> {
        const yardRepository = getManager().getRepository(YardSelectionEntity);

        return await yardRepository
            .createQueryBuilder()
            .select(
                `yard.uid as uid, 
                yard.yard_name as yardName, 
                yard.yard_location as yardLocation, 
                yard.export_status as exportStatus, 
                yard.import_status as importStatus, 
                yard.active_status as activeStatus, 
                yard.created_by_uid as createdBy`,
            )
            .where(`yard.active_status = 1 and yard.uid='${uid}'`)
            .getRawMany();
    }

    public async CreateYardSelection(data: CreateAndUpdateYardSelectionDto, queryRunner: QueryRunner) {
        const yard = new YardSelectionEntity();
        yard.created_at = new Date();
        yard.active_status = true;
        const result = await queryRunner.manager.insert(YardSelectionEntity, yard);
        return result;
    }
}
