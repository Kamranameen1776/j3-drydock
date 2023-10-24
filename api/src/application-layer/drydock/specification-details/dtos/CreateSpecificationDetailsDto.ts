import { BaseSpecificationDetailsDto } from './BaseSpecificationDetailsDto';

export class CreateSpecificationDetailsDto extends BaseSpecificationDetailsDto {
    // public uid?: uniqueidentifier;
    // public function_uid: uniqueidentifier;
    // public component_uid: uniqueidentifier;
    public account_code: string;
    // public item_source: uniqueidentifier;
    public item_number: string;
    public done_by: string;
    public item_category: string;
    public inspection: string;
    public equipment_description: string;
    public priority: string;
    public description: string;
    public start_date: Date;
    public estimated_dates: Date;
    public buffer_time: number;
    public treatment: string;
    public onboard_location: string;
    public access: string;
    //public material_supplied_by: uniqueidentifier;
    public test_criteria: string;
    public ppe: string;
    public safety_instruction: string;
    public active_status: boolean;
    public date_of_creation: Date;
    public created_by: number;
}
