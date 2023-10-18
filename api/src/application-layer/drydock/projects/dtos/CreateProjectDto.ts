import { BaseProjectDto } from "./BaseProjectDto";

export class CreateProjectDto extends BaseProjectDto {
    public ProjectCode?: string;
    public CreatedAtOffice?: boolean;
    public ProjectStateId?: number;
}
