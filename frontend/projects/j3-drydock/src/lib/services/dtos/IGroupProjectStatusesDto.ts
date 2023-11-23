import { IGroupProjectStatusDto } from './IGroupProjectStatusDto';

export interface IGroupProjectStatusesDto {
  ProjectTypeId: string;

  ProjectTypeName: string;

  GroupProjectStatuses: IGroupProjectStatusDto[];
}
