import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { IGetProjectTemplateGridDto } from './IGetProjectTemplateGridDto';

export class ProjectTemplateRepository {
    public async TryGetProjectTemplateByUid(projectTemplateUid: string): Promise<ProjectTemplateEntity | undefined> {
        const repository = getManager().getRepository(ProjectTemplateEntity);

        return repository.findOne({
            where: {
                uid: projectTemplateUid,
                ActiveStatus: true,
            },
        });
    }

    public async GetProjectTemplateGridData(
        request: Req<ODataBodyDto>,
    ): Promise<ODataResult<IGetProjectTemplateGridDto>> {
        const oDataService = new ODataService(request, getConnection);

        const repository = getManager().getRepository(ProjectTemplateEntity);

        // TODO: populate data
        const query = repository.createQueryBuilder('prt').select(['prt.uid AS ProjectTemplateUid']);

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
