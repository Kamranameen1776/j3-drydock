import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ProjectTemplateStandardJobEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { IGetProjectTemplateStandardJobsGridDto } from './IGetProjectTemplateStandardJobsGridDto';

export class ProjectTemplateStandardJobRepository {
    public async GetProjectTemplateStandardJobsByProjectTemplateUid(projectTemplateUid: string) {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        return repository.find({
            where: {
                ProjectTemplateUid: projectTemplateUid,
                ActiveStatus: true,
            },
        });
    }
    public async CreateProjectTemplateStandardJobs(
        projectTemplateStandardJob: ProjectTemplateStandardJobEntity,
        queryRunner: QueryRunner,
    ): Promise<string> {
        const uid = DataUtilService.newUid();
        projectTemplateStandardJob.uid = uid;

        await queryRunner.manager.save(projectTemplateStandardJob);

        return uid;
    }

    public async UpdateProjectTemplateStandardJobs(
        projectTemplateStandardJob: ProjectTemplateStandardJobEntity,
        queryRunner: QueryRunner,
    ): Promise<void> {
        await queryRunner.manager.save(projectTemplateStandardJob);
    }

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

    public async GetProjectTemplateStandardJobsGridData(
        request: Req<ODataBodyDto>,
    ): Promise<ODataResult<IGetProjectTemplateStandardJobsGridDto>> {
        const oDataService = new ODataService(request, getConnection);

        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        const query = repository.createQueryBuilder('prtsj').select(
            `prtsj.uid AS ProjectTemplateStandardJobUid,

            -- TODO: populate with real data
            123 as ItemNumber,
            123 as Subject,
            123 as VesselType,
            123 as InspectionSurvey,
            123 as DoneBy,
            123 MaterialSuppliedBy
        `,
        );

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
