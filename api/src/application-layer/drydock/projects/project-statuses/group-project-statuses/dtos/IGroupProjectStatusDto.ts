export interface IGroupProjectStatusDto {
    GroupProjectStatusId: string;

    ProjectWithStatusCount: number;

    GroupProjectDisplayName: string;

    StatusOrder: number;
}

export interface IGroupProjectStatusesDto {
    ProjectTypeName: string;

    GroupProjectStatuses: IGroupProjectStatusDto[];
}

export interface IGroupResponseDto {
    [key: string]: IGroupProjectStatusesDto;
}
