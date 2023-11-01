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
            .select(
                `spec.uid as uid,
                spec.tec_task_manager_uid as tm_task,
                spec.function_uid as functionUid,
                spec.component_uid as componentUid,
                spec.account_code as accountCode,
                spec.item_source_uid as itemSourceUid,
                spec.item_number as itemNumber,
                spec.done_by_uid as doneByUid,
                spec.item_category_uid as itemCategoryUid,
                spec.inspection_uid as inspectionUid,
                spec.equipment_description as equipmentDescription,
                spec.priority_uid as priorityUid,
                spec.description as description,
                spec.start_date as startDate,
                spec.estimated_days as estimatedDays,
                spec.buffer_time as bufferTime,
                spec.treatment as treatment,
                spec.onboard_location_uid as onboardLocationUid,
                spec.access as access,
                spec.material_supplied_by_uid as materialSuppliedByUid,
                spec.test_criteria as testCriteria,
                spec.ppe as ppe,
                spec.safety_instruction as safetyInstruction,
                spec.active_status as activeStatus,
                spec.created_by as createdBy,
                spec.created_at as createdAt
                `,
            )

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
