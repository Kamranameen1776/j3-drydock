import { UpdateResult } from 'typeorm';

import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteProjectTemplateModel } from './DeleteProjectTemplateModel';

export class DeleteProjectTemplateCommand extends Command<DeleteProjectTemplateModel, UpdateResult> {
    uow = new UnitOfWork();
    projectTemplateRepository = new ProjectTemplateRepository();

    protected async MainHandlerAsync(request: DeleteProjectTemplateModel) {
        return this.uow.ExecuteAsync(async (queryRunner) => {
            return this.projectTemplateRepository.deleteProjectTemplate(
                request.ProjectTemplateUid,
                request.DeletedBy,
                queryRunner,
            );
        });
    }
}
