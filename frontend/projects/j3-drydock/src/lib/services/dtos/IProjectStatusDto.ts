import { eProjectWorkflowStatusAction } from '../../models/enums/project-details.enum';

export interface IProjectStatusDto {
  ProjectStatusId: eProjectWorkflowStatusAction;
  ProjectStatusName: string;
}
