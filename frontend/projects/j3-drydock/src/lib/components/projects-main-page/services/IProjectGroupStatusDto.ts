import { eProjectStatus } from '../../../models/enums/project-details.enum';

export interface IProjectGroupStatusDto {
  ProjectTypeId: string;
  GroupProjectStatusId?: eProjectStatus;
}
