import { BaseProjectDto } from './BaseProjectDto';

export class CreateProjectDto extends BaseProjectDto {
    public ProjectCode?: string;
    public CreatedAtOffice?: number;
    public ProjectStateId?: number;
    public TaskManagerUid?: string;
}
