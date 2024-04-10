import { eProjectStatus } from '../../models/enums/project-details.enum';

export interface IGroupProjectStatusDto {
  GroupProjectStatusId: eProjectStatus;

  GroupProjectDisplayName: string;

  ProjectWithStatusCount: number | undefined;
}
