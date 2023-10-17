import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class GetSpecificationDetailsQueryRepository {
    public async GetSpecificationDetailsQueryRepository(data: Request): Promise<GetSpecificationDetailsResultDto[]> {
        const oDataService = new ODataService(data, getConnection);

        const query = getManager()
            .createQueryBuilder('specification_jobs', 'sd')
            .select(
                'sd.uid as uid,' +
                    'sd.function_uid as Function,' +
                    'sd.component_uid as Component,' +
                    'sd.account_code,' +
                    'sd.item_number,' +
                    'sd.item_source,' +
                    'sd.done_by,' +
                    'sd.item_category,' +
                    'sd.equipment_description,' +
                    'sd.active_status as activeStatus,' +
                    'sd.inspection,' +
                    'sd.priority,' +
                    'sd.description,' +
                    'sd.scope,' +
                    'sd.unit,' +
                    'sd.quantity,' +
                    'sd.unit_price,' +
                    'sd.discount,' +
                    'sd.cost,' +
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
    }
}
