import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { ProjectTemplateGridFiltersKeys } from '../../../application-layer/drydock/project-template/ProjectTemplateConstants';
import { className } from '../../../common/drydock/ts-helpers/className';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { LibVesseltypes, ProjectTypeEntity, TecLibWorklistTypeEntity } from '../../../entity/drydock';
import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { ProjectTemplateVesselTypeEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateVesselTypeEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { RepoUtils } from '../utils/RepoUtils';
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
        filters: Record<ProjectTemplateGridFiltersKeys, string[]>,
    ): Promise<ODataResult<IGetProjectTemplateGridDto>> {
        const oDataService = new ODataService(request, getConnection);

        const repository = getManager().getRepository(ProjectTemplateEntity);

        let query = repository
            .createQueryBuilder('prt')
            .select(
                `prt.uid AS ProjectTemplateUid,
            'PT-O-'+ FORMAT(prt.TemplateCode, '0000') AS TemplateCode,
            prt.Subject AS Subject,
            wt.WorklistTypeDisplay as ProjectType,
            wt.WorklistType as ProjectTypeCode,
            pt.ProjectTypeUid as ProjectTypeUid,
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'ID', 'aliased.active_status = 1', 'VesselTypeId', {
                entity: className(ProjectTemplateVesselTypeEntity),
                alias: 'ptvt',
                on: 'ptvt.project_template_uid = sj.uid AND aliased.ID = ptvt.vessel_type_id',
            })}
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'VesselTypes', 'aliased.active_status = 1', 'VesselType', {
                entity: className(ProjectTemplateVesselTypeEntity),
                alias: 'ptvt',
                on: 'ptvt.project_template_uid = sj.uid AND aliased.ID = ptvt.vessel_type_id',
            })},
            COUNT(sj.uid) as NoOfSpecItems,
            prt.LastUpdated as LastUpdated
            `,
            )
            .innerJoin(ProjectTypeEntity, 'pt', 'prt.ProjectTypeUid = pt.uid')
            .innerJoin(TecLibWorklistTypeEntity, 'wt', 'pt.WorklistType = wt.WorklistType')
            .innerJoin(ProjectTemplateVesselTypeEntity, 'ptvt', 'prt.uid = ptvt.project_template_uid')
            .leftJoin(ProjectTemplateStandardJobEntity, 'sj', 'prt.uid = sj.ProjectTemplateUid AND sj.ActiveStatus = 1')
            .leftJoin(LibVesseltypes, 'vt', `vt.ID = ptvt.vessel_type_id and vt.Active_Status = 1`)
            .groupBy(
                [
                    'prt.uid',
                    'prt.template_code',
                    'prt.subject',
                    'pt.project_type_uid',
                    'prt.last_updated',
                    'wt.worklist_type_display',
                    'wt.worklist_type',
                ].join(','),
            );

        if (filters.vesselTypeId?.length) {
            query = query.andWhere(`vt.ID IN (:...vesselTypeId)`, { vesselTypeId: filters.vesselTypeId });
        }

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
