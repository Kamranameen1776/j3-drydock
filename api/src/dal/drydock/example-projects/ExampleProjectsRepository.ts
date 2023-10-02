import { getManager } from 'typeorm';

import { GetExampleProjectsResultDto } from './dtos/GetExampleProjectsResultDto';

export class ExampleProjectsRepository {
    public async CreateProject(name: string, dateOfCreation: Date): Promise<number> {
        const result = await getManager().query(
            `
            INSERT INTO [drydock].[ExampleProject]
            ([ProjectName]
            ,[DateOfCreation])
      VALUES
            (@0
            ,@1)
            
            SELECT CAST(scope_identity() AS INT) as [ExampleProjectId];
            `,
            [name, dateOfCreation.toISOString()],
        );

        return result[0].ExampleProjectId;
    }

    public async GetExampleProjects(minDateOfCreation: Date): Promise<GetExampleProjectsResultDto[]> {
        const result = await getManager().query(
            `
        --
        -- Declare script input parameters
        --
        DECLARE @minDateOfCreation DATE = @0;

        --
        -- Declare script
        --
        SELECT [ExampleProjectId], 
            [ProjectName],
            [DateOfCreation] 

        FROM [drydock].[ExampleProject]

        WHERE [DateOfCreation] >= @minDateOfCreation

        ORDER BY [ProjectName] ASC, 
            [DateOfCreation] ASC;
        `,
            [minDateOfCreation.toISOString()],
        );

        return result;
    }
}
