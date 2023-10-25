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

    public async GetManySpecificationDetails(data: Request): Promise<GetSpecificationDetailsResultDto[]> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder('specification_details', 'sd')
                .leftJoin('[dto].[tm_dd_lib_item_category]', 'ic', 'sd.item_category = ic.uid')
                .leftJoin('[dto].[tm_dd_lib_done_by]', 'db', 'sd.done_by = db.uid')
                .select(
                    'sd.uid as uid,' +
                        'sd.function_uid as Function,' +
                        'sd.component_uid as Component,' +
                        'sd.account_code,' +
                        'sd.item_number,' +
                        'sd.item_source,' +
                        'db.done_by,' +
                        'ic.item_category,' +
                        'sd.inspection,' +
                        'sd.equipment_description,' +
                        'sd.active_status,' +
                        'sd.priority,' +
                        'sd.description,' +
                        'sd.start_date,' +
                        'sd.estimated_dates,' +
                        'sd.buffer_time,' +
                        'sd.treatment,' +
                        'sd.onboard_location,' +
                        'sd.access,' +
                        'sd.material_supplied_by,' +
                        'sd.test_criteria,' +
                        'sd.ppe,' +
                        'sd.safety_instruction',
                )
                .where('sd.active_status = 1')
                .getSql();

            const result = await oDataService.getJoinResult(query);
            return result.records;
        } catch (error) {
            throw new Error(
                `Method: GetSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }

    public async CreateSpecificationDetails(
        data: CreateSpecificationDetailsDto,
        queryRunner: QueryRunner,
    ): Promise<any> {
        const spec = new SpecificationDetailsEntity();
        spec.uid = new DataUtilService().newUid();
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
        spec.active_status = data.activeStatus;
        spec.created_by_uid = data.createdByUid;
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
