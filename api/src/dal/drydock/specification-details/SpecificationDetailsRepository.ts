import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { CreateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/CreateSpecificationDetailsDto';
import { DeleteSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationDetailsDto';
import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { SpecificationDetailsEntity } from '../../../entity/specification_details';
import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class SpecificationDetailsRepository {
    public async findOneBySpecificationUid(uid: string): Promise<GetSpecificationDetailsResultDto[]> {
        const specificationDetailsRepository = getManager().getRepository(SpecificationDetailsEntity);

        const result = await specificationDetailsRepository
            .createQueryBuilder('spec')
            .where('spec.active_status = 1 and spec.uid = :uid', { uid: uid })
            .execute();

        return result;
    }

    public async CreateSpecificationDetails(
        data: CreateSpecificationDetailsDto,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const spec = new SpecificationDetailsEntity();
        spec.uid = new DataUtilService().newUid();
        spec.function_uid = data.function_uid;
        spec.component_uid = data.component_uid;
        spec.account_code = data.account_code;
        spec.item_source = data.item_source;
        spec.item_number = data.item_number;
        spec.done_by = data.done_by;
        spec.item_category = data.item_category;
        spec.inspection = data.inspection;
        spec.equipment_description = data.equipment_description;
        spec.priority = data.priority;
        spec.description = data.description;
        spec.start_date = data.start_date;
        spec.estimated_days = data.estimated_days;
        spec.buffer_time = data.buffer_time;
        spec.treatment = data.treatment;
        spec.onboard_location = data.onboard_location;
        spec.access = data.access;
        spec.material_supplied_by = data.material_supplied_by;
        spec.test_criteria = data.test_criteria;
        spec.ppe = data.ppe;
        spec.safety_instruction = data.safety_instruction;
        spec.active_status = data.active_status;
        spec.created_by = data.created_by;
        spec.created_at = new Date();

        const result = await queryRunner.manager.insert(SpecificationDetailsEntity, spec);
        return result;
    }

    public async UpdateSpecificationDetails(
        data: UpdateSpecificationDetailsDto | DeleteSpecificationDetailsDto,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const result = await queryRunner.manager.update(SpecificationDetailsEntity, data.uid, data);
        return result;
    }
}
