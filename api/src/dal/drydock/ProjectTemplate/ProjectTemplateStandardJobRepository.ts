import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ProjectTemplateStandardJobEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { IGetProjectTemplateStandardJobsGridDto } from './IGetProjectTemplateStandardJobsGridDto';

export class ProjectTemplateStandardJobRepository {
    public async TryGetProjectTemplateStandardJobByUid(
        projectTemplateStandardJobUid: string,
    ): Promise<ProjectTemplateStandardJobEntity | undefined> {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        return repository.findOne({
            where: {
                uid: projectTemplateStandardJobUid,
                ActiveStatus: true,
            },
        });
    }

    public async SaveProjectTemplateStandardJob(
        projectTemplateStandardJobEntity: ProjectTemplateStandardJobEntity,
    ): Promise<void> {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        repository.save(projectTemplateStandardJobEntity);
    }

    // public async ListByProjectTemplateUid(projectTemplateUid: string): Promise<ProjectTemplateStandardJobEntity[]> {
    //     const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

    //     return repository.find({
    //         where: {
    //             ProjectTemplateUid: projectTemplateUid,
    //             ActiveStatus: true,
    //         },
    //     });
    // }

    public async GetProjectTemplateStandardJobsGridData(
        request: Req<ODataBodyDto>,
    ): Promise<ODataResult<IGetProjectTemplateStandardJobsGridDto>> {
        const oDataService = new ODataService(request, getConnection);

        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        // TODO: populate data
        const query = repository.createQueryBuilder('prtsj').select(['prtsj.uid AS ProjectTemplateStandardJobUid']);

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
