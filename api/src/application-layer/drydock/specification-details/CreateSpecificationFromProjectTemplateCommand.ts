import { validateAgainstModel } from '../../../common/drydock/ts-helpers/validate-against-model';
import { ProjectTemplateStandardJobRepository } from '../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { CreateSpecificationFromProjectTemplateDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromProjectTemplateDto';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { CreateSpecificationFromStandardJobsCommand } from './CreateSpecificationFromStandardJobCommand';

export class CreateSpecificationFromProjectTemplateCommand extends Command<
    CreateSpecificationFromProjectTemplateDto,
    SpecificationDetailsEntity[]
> {
    projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();

    protected async ValidationHandlerAsync(request: CreateSpecificationFromProjectTemplateDto): Promise<void> {
        await validateAgainstModel(CreateSpecificationFromProjectTemplateDto, request);
    }

    protected async MainHandlerAsync(request: CreateSpecificationFromProjectTemplateDto) {
        const standardJobs =
            await this.projectTemplateStandardJobRepository.GetProjectTemplateStandardJobsByProjectTemplateUid(
                request.ProjectTemplateUid,
            );

        const standardJobsUid = standardJobs.map((sj) => sj.StandardJobUid);

        const dto: CreateSpecificationFromStandardJobDto = {
            token: request.token,
            createdBy: request.createdBy,
            StandardJobUid: standardJobsUid,
            ProjectUid: request.ProjectUid,
        };

        const query = new CreateSpecificationFromStandardJobsCommand();

        return query.ExecuteAsync(dto);
    }
}
