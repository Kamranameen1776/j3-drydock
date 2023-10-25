// Repository method name eq to the dto name + 'ResultsDto' suffix
export class GetSpecificationDetailsResultDto {
    uid: string;
    function_uid: string;
    component_uid: string;
    account_code: string;
    item_source: string;
    item_number: string;
    done_by: string;
    item_category: string;
    inspection: string;
    equipment_description: string;
    priority: string;
    description: string;
    start_date: Date;
    estimated_days: number;
    buffer_time: number;
    treatment: string;
    onboard_location: string;
    access: string;
    material_supplied_by: string;
    test_criteria: string;
    ppe: string;
    safety_instruction: string;
    updated_by: string;
    updated_at: Date;
    deleted_by: string;
    deleted_at: Date;
}
