import { ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner, SelectQueryBuilder } from 'typeorm';

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
import { getChunkSize } from '../../../shared/utils/get-chunk-size';
import { RepoUtils } from '../utils/RepoUtils';
import { IGetProjectTemplateStandardJobsGridQueryResult } from './IGetProjectTemplateStandardJobsGridDto';

export class ProjectTemplateStandardJobRepository {
    public async GetProjectTemplateStandardJobsByProjectTemplateUid(projectTemplateUid: string) {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        return repository
            .createQueryBuilder('prtsj')
            .innerJoin(StandardJobs, 'sj', 'sj.uid = prtsj.StandardJobUid AND sj.active_status = 1')
            .where('prtsj.ProjectTemplateUid = :projectTemplateUid AND prtsj.active_status = 1', {
                projectTemplateUid,
            })
            .getMany();
    }

    public async CreateOrUpdateProjectTemplateStandardJobs(
        projectTemplateStandardJob: ProjectTemplateStandardJobEntity | ProjectTemplateStandardJobEntity[],
        queryRunner: QueryRunner,
    ): Promise<string | string[]> {
        await queryRunner.manager.save(projectTemplateStandardJob, {
            chunk: getChunkSize(5),
            /* Since we don't have limit to amount of standard jobs to be changed in one transaction
            and driver has limit on 2100 parameters (5 is amount of parameters per one relation) we need to split it into chunks */
        });

        if (Array.isArray(projectTemplateStandardJob)) {
            return projectTemplateStandardJob.map((entity) => entity.StandardJobUid);
        } else {
            return projectTemplateStandardJob.StandardJobUid;
        }
    }

    public async TryGetProjectTemplateStandardJobByUid(
        projectTemplateStandardJobUid: string,
    ): Promise<ProjectTemplateStandardJobEntity | undefined> {
        const repository = getManager().getRepository(ProjectTemplateStandardJobEntity);

        return repository.findOne({
            where: {
                uid: projectTemplateStandardJobUid,
                active_status: true,
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
    ): Promise<IGetProjectTemplateStandardJobsGridQueryResult> {
        const oDataService = new ODataService(request, getConnection);
        const query = this.getSpecificationItemCountQuery();
        const [sql, parameters] = query.getQueryAndParameters();
        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }

    public getSpecificationItemCountQuery(qb?: SelectQueryBuilder<any>) {
        const repository = qb? qb.from(className(ProjectTemplateStandardJobEntity),'prtsj')
                      : getManager().createQueryBuilder(ProjectTemplateStandardJobEntity,'prtsj');
        const query = repository.select(
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
            .innerJoin(ProjectTemplateEntity, 'pt', 'pt.uid = prtsj.ProjectTemplateUid AND pt.active_status = 1')
            .leftJoin(TmDdLibDoneBy, 'db', `db.uid = sj.done_by_uid AND db.active_status = 1`)
            .leftJoin(
                TmDdLibMaterialSuppliedBy,
                'msb',
                `msb.uid = sj.material_supplied_by_uid AND msb.active_status = 1`,
            )
            .groupBy(
                [
                    'sj.uid',
                    'prtsj.project_template_uid',
                    'sj.code',
                    'sj.subject',
                    'sj.done_by_uid',
                    'db.displayName',
                    'msb.display_name',
                    'sj.material_supplied_by_uid',
                ].join(','),
            )
            .where('prtsj.active_status = 1');
            return query;
    }
}
