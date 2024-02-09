import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { IGetProjectTemplateGridDto } from './IGetProjectTemplateGridDto';

export class ProjectTemplateRepository {
    public async CreateProjectTemplate(
        projectTemplate: ProjectTemplateEntity,
        queryRunner: QueryRunner,
    ): Promise<string> {
        const uid = DataUtilService.newUid();
        projectTemplate.uid = uid;

        await queryRunner.manager.save(projectTemplate);

        return uid;
    }

    public async UpdateProjectTemplate(
        projectTemplate: ProjectTemplateEntity,
        queryRunner: QueryRunner,
    ): Promise<void> {
        await queryRunner.manager.save(projectTemplate);
    }

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

        const query = repository.createQueryBuilder('prt').select(
            `prt.uid AS ProjectTemplateUid,
            'PT-O-'+ FORMAT(prt.TemplateCode, '0000') AS TemplateCode,
            prt.Subject AS Subject,

            -- TODO: get real data
            'Dry Dock' as ProjectType,
            'All' as VesselType,
            123 as NoOfSpecItems,


            prt.LastUpdated as LastUpdated
            `,
        );

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
