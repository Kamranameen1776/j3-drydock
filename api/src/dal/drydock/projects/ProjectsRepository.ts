import { getManager } from 'typeorm';

import { ProjectState } from '../../../bll/drydock/entities/ProjectState';
import { ProjectType } from '../../../bll/drydock/entities/ProjectType';
import { GetProjectsForMainPageResultDto } from './dtos/GetProjectsForMainPageResultDto';

export class ProjectsRepository {
    public async GetProjectTypes(): Promise<ProjectType[]> {
        const result = await getManager().query(
            `
            SELECT [ProjectTypeCode]
            ,[ProjectTypeName]
        FROM [drydock].[ProjectType]
        WHERE [DateOfDeletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectStates(): Promise<ProjectState[]> {
        const result = await getManager().query(
            `
            SELECT [ProjectStateCode]
            ,[ProjectStateName]
        FROM [drydock].[ProjectState]
        WHERE [DateOfDeletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectsForMainPage(): Promise<GetProjectsForMainPageResultDto[]> {
        const result = await getManager().query(
            `
            SELECT [ProjectId]
            ,[ProjectShortCodeId]
            ,[CreatedAtOffice]
            ,[Lib_VesselsVessel_ID]
            ,[ProjectTypeProjectTypeCode]
            ,[ProjectStateProjectStateCode]
            ,[Subject]
            ,[ProjectManagerLib_UserUid]
            ,[StartDate]
            ,[EndDate]
            ,[DateOfCreation]
            ,[DateOfDeletion]
        FROM [drydock].[Project]
        WHERE [DateOfDeletion] IS NULL
            `,
        );

        return result;
    }
}
