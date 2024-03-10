export interface IGroupProjectStatusDto {
    GroupProjectStatusId: string;

    ProjectWithStatusCount: number;

    GroupProjectDisplayName: string;

    StatusOrder: number;
}

export interface IGroupProjectStatusAsyncDto {
    GroupProjectStatusId: string;

    GroupProjectDisplayName: string;

    StatusOrder: number;
}

export interface IGroupProjectStatusesAsyncDto {
    ProjectTypeName: string;

    GroupProjectStatuses: IGroupProjectStatusAsyncDto[];
}

export interface IGroupResponseAsyncDto {
    [key: string]: IGroupProjectStatusesAsyncDto;
}

export interface IGroupProjectStatusesDto {
    ProjectTypeName: string;

    GroupProjectStatuses: IGroupProjectStatusDto[];
}

export interface IGroupResponseDto {
    [key: string]: IGroupProjectStatusesDto;
}
