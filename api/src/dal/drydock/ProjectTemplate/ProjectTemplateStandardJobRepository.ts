import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import {
    LibSurveyCertificateAuthority,
    LibVesseltypes,
    StandardJobs,
    StandardJobsSurveyCertificateAuthorityEntity,
    StandardJobsVesselTypeEntity,
    TmDdLibDoneBy,
    TmDdLibMaterialSuppliedBy,
} from '../../../entity/drydock';
import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { RepoUtils } from '../utils/RepoUtils';
import { IGetProjectTemplateStandardJobsGridDto } from './IGetProjectTemplateStandardJobsGridDto';

export class ProjectTemplateStandardJobRepository {
    public async GetProjectTemplateStandardJobsByProjectTemplateUid(projectTemplateUid: string) {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        return repository.find({
            where: {
                ProjectTemplateUid: projectTemplateUid,
                ActiveStatus: true,
                StandardJob: {
                    active_status: true,
                },
            },
            relations: ['StandardJob'],
        });
    }

    public async CreateProjectTemplateStandardJobs(
        projectTemplateStandardJob: ProjectTemplateStandardJobEntity,
        queryRunner: QueryRunner,
    ): Promise<string> {
        await queryRunner.manager.save(projectTemplateStandardJob);

        return projectTemplateStandardJob.StandardJobUid;
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

        const query = repository
            .createQueryBuilder('prtsj')
            .select(
                `sj.uid AS StandardJobUid,
            prtsj.ProjectTemplateUid as ProjectTemplateUid,
            sj.code as ItemNumber,
            sj.subject as Subject,
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'ID', 'aliased.active_status = 1', 'VesselTypeId', {
                entity: className(StandardJobsVesselTypeEntity),
                alias: 'sjvt',
                on: 'sjvt.standard_job_uid = sj.uid AND aliased.ID = sjvt.vessel_type_id',
            })},
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'VesselTypes', 'aliased.active_status = 1', 'VesselType', {
                entity: className(StandardJobsVesselTypeEntity),
                alias: 'sjvt',
                on: 'sjvt.standard_job_uid = sj.uid AND aliased.ID = sjvt.vessel_type_id',
            })},
            ${RepoUtils.getStringAggJoin(
                LibSurveyCertificateAuthority,
                'Authority',
                'aliased.active_status = 1',
                'InspectionSurvey',
                {
                    entity: className(StandardJobsSurveyCertificateAuthorityEntity),
                    alias: 'sjsca',
                    on: 'sjsca.standard_job_uid = sj.uid AND aliased.ID = sjsca.survey_id',
                },
            )},
            ${RepoUtils.getStringAggJoin(
                LibSurveyCertificateAuthority,
                'ID',
                'aliased.active_status = 1',
                'InspectionSurveyId',
                {
                    entity: className(StandardJobsSurveyCertificateAuthorityEntity),
                    alias: 'sjsca',
                    on: 'sjsca.standard_job_uid = sj.uid AND aliased.ID = sjsca.survey_id',
                },
            )},
            sj.done_by_uid as DoneByUid,
            db.displayName as DoneBy,
            sj.material_supplied_by_uid as MaterialSuppliedByUid,
            msb.display_name MaterialSuppliedBy
        `,
            )
            .innerJoin(StandardJobs, 'sj', 'prtsj.StandardJobUid = sj.uid AND sj.active_status = 1')
            .innerJoin(ProjectTemplateEntity, 'pt', 'pt.uid = prtsj.ProjectTemplateUid AND pt.ActiveStatus = 1')
            .leftJoin(StandardJobsVesselTypeEntity, 'sjvt', `sjvt.standard_job_uid = sj.uid`)
            .leftJoin(StandardJobsSurveyCertificateAuthorityEntity, 'sjsca', `sjsca.standard_job_uid = sj.uid`)
            .leftJoin(LibSurveyCertificateAuthority, 'lsca', `lsca.ID = sjsca.survey_id and lsca.Active_Status = 1`)
            .leftJoin(LibVesseltypes, 'vt', `vt.ID = sjvt.vessel_type_id and vt.Active_Status = 1`)
            .leftJoin(TmDdLibDoneBy, 'db', `db.uid = sj.done_by_uid AND db.active_status = 1`)
            .leftJoin(
                TmDdLibMaterialSuppliedBy,
                'msb',
                `msb.uid = sj.material_supplied_by_uid AND msb.active_status = 1`,
            )
            .groupBy(
                [
                    'prtsj.uid',
                    'sj.uid',
                    'prtsj.project_template_uid',
                    'sj.code',
                    'sj.subject',
                    'sj.done_by_uid',
                    'db.displayName',
                    'msb.display_name',
                    'sj.material_supplied_by_uid',
                ].join(','),
            );

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }
}
