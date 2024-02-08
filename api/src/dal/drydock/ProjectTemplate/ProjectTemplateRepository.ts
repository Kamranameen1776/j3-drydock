import { getManager } from 'typeorm';

import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntityTableName } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';

export class ProjectTemplateRepository {
    public async TryGetProjectTemplateByUid(projectTemplateUid: string): Promise<ProjectTemplateEntity | undefined> {
        const repository = getManager().getRepository(ProjectTemplateEntity);

        return repository.findOne({
            where: {
                uid: projectTemplateUid,
                ActiveStatus: true,
            },
            relations: [ProjectTemplateStandardJobEntityTableName],
        });
    }
}
