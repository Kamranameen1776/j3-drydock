import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { CreateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/CreateSpecificationDetailsDto';
import { DeleteSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationDetailsDto';
import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { SpecificationDetailsEntity } from '../../../entity/specification_details';
import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class SpecificationDetailsRepository {
    public async GetSpecificationDetails(data: Request): Promise<GetSpecificationDetailsResultDto[]> {
        try {
            const oDataService = new ODataService(data, getConnection);

            const query = getManager()
                .createQueryBuilder('specification_details', 'sd')
                .select(
                    'sd.uid as uid,' +
                        'sd.function_uid as Function,' +
                        'sd.component_uid as Component,' +
                        'sd.account_code,' +
                        'sd.item_number,' +
                        'sd.item_source,' +
                        'sd.done_by,' +
                        'sd.item_category,' +
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
        try {
            const spec = new SpecificationDetailsEntity();
            spec.uid = new DataUtilService().newUid();
            // spec.function_uid = data.function_uid as uniqueidentifier;
            // spec.component_uid = data.component_uid as uniqueidentifier;
            spec.account_code = data.account_code;
            //spec.item_source = data.item_source as uniqueidentifier;
            spec.item_number = data.item_number;
            spec.done_by = data.done_by;
            spec.item_category = data.item_category;
            spec.inspection = data.inspection;
            spec.equipment_description = data.equipment_description;
            spec.priority = data.priority;
            spec.description = data.description;
            spec.start_date = data.start_date;
            spec.estimated_dates = data.estimated_dates;
            spec.buffer_time = data.buffer_time;
            spec.treatment = data.treatment;
            spec.onboard_location = data.onboard_location;
            spec.access = data.access;
            //spec.material_supplied_by = data.material_supplied_by as uniqueidentifier;
            spec.test_criteria = data.test_criteria;
            spec.ppe = data.ppe;
            spec.safety_instruction = data.safety_instruction;
            spec.active_status = data.active_status;
            spec.date_of_creation = new Date();
            spec.created_by = data.created_by;

            const result = await queryRunner.manager.insert(SpecificationDetailsEntity, spec);
            return result;
        } catch (error) {
            throw new Error(
                `Method: CreateSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }

    public async UpdateSpecificationDetails(
        data: UpdateSpecificationDetailsDto | DeleteSpecificationDetailsDto,
        queryRunner: QueryRunner,
    ): Promise<any> {
        try {
            const result = await queryRunner.manager.update(SpecificationDetailsEntity, data.uid, data);
            return result;
        } catch (error) {
            throw new Error(
                `Method: UpdateSpecificationDetails / Class: SpecificationDetailsRepository / Error: ${error}`,
            );
        }
    }
}
