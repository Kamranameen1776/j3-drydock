import { BaseSpecificationDetailsDto } from './BaseSpecificationDetailsDto';

export class CreateSpecificationDetailsDto extends BaseSpecificationDetailsDto {
    public uid?: string;
    public function_uid: string;
    public component_uid: string;
    public account_code: string;
    public item_source: string;
    public item_number: string;
    public done_by: string;
    public item_category: string;
    public inspection: string;
    public equipment_description: string;
    public priority: string;
    public description: string;
    public start_date: Date;
    public estimated_days: number;
    public buffer_time: number;
    public treatment: string;
    public onboard_location: string;
    public access: string;
    public material_supplied_by: string;
    public test_criteria: string;
    public ppe: string;
    public safety_instruction: string;
    public active_status: boolean;
    public created_by: string;
    public created_at: Date;
}
