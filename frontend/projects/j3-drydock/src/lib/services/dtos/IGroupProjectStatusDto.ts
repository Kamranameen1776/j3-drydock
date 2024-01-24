import { eProjectStatus } from '../../models/enums/project-details.enum';

export interface IGroupProjectStatusDto {
  GroupProjectStatusId: eProjectStatus;

  ProjectWithStatusCount: number;
}
