import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { CreateAndUpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/CreateAndUpdateSpecificationDetailsDto';
import { DeleteSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationDetailsDto';
import { SpecificationDetailsEntity } from '../../../entity/SpecificationDetailsEntity';
import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class SpecificationDetailsRepository {
    public async findOneBySpecificationUid(uid: string): Promise<GetSpecificationDetailsResultDto[]> {
        const result = await getManager()
            .createQueryBuilder()
            .from('specification_details', 'spec')
            .select('spec.*')
            .where(`spec.active_status = 1 and spec.uid='${uid}'`)
            .getRawMany();

        return result;
    }

    public async CreateSpecificationDetails(data: CreateAndUpdateSpecificationDetailsDto, queryRunner: QueryRunner) {
        const spec = await this.specData(data);
        spec.created_at = new Date();
        spec.active_status = true;
        const result = await queryRunner.manager.insert(SpecificationDetailsEntity, spec);
        return result;
    }

    public async UpdateSpecificationDetails(data: CreateAndUpdateSpecificationDetailsDto, queryRunner: QueryRunner) {
        const spec = await this.specData(data);
        const result = await queryRunner.manager.update(SpecificationDetailsEntity, spec.uid, spec);
        return result;
    }

    public async DeleteSpecificationDetails(data: DeleteSpecificationDetailsDto, queryRunner: QueryRunner) {
        const result = await queryRunner.manager.delete(SpecificationDetailsEntity, data.uid);
        return result;
    }

    public async specData(data: CreateAndUpdateSpecificationDetailsDto) {
        const spec = new SpecificationDetailsEntity();
        spec.uid = data?.uid ? data.uid : new DataUtilService().newUid();
        spec.tec_task_manager_uid = data.tmTask;
        spec.function_uid = data.functionUid;
        spec.component_uid = data.componentUid;
        spec.account_code = data.accountCode;
        spec.item_source_uid = data.itemSourceUid;
        spec.item_number = data.itemNumber;
        spec.done_by_uid = data.doneByUid;
        spec.item_category_uid = data.itemCategoryUid;
        spec.inspection_uid = data.inspectionUid;
        spec.equipment_description = data.equipmentDescription;
        spec.priority_uid = data.priorityUid;
        spec.description = data.description;
        spec.start_date = data.startDate;
        spec.estimated_days = data.estimatedDays;
        spec.buffer_time = data.bufferTime;
        spec.treatment = data.treatment;
        spec.onboard_location_uid = data.onboardLocationUid;
        spec.access = data.access;
        spec.material_supplied_by_uid = data.materialSuppliedByUid;
        spec.test_criteria = data.testCriteria;
        spec.ppe = data.ppe;
        spec.safety_instruction = data.safetyInstruction;
        return spec;
    }
}
