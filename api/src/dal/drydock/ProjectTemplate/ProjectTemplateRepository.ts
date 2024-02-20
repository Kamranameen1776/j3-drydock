import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner, UpdateResult } from 'typeorm';

import { ProjectTemplateGridFiltersKeys } from '../../../application-layer/drydock/project-template/ProjectTemplateConstants';
import { className } from '../../../common/drydock/ts-helpers/className';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { LibVesseltypes, ProjectTypeEntity, TecLibWorklistTypeEntity } from '../../../entity/drydock';
import { ProjectTemplateEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { ProjectTemplateVesselTypeEntity } from '../../../entity/drydock/ProjectTemplate/ProjectTemplateVesselTypeEntity';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { getChunkSize } from '../../../shared/utils/get-chunk-size';
import { RepoUtils } from '../utils/RepoUtils';
import { IGetProjectTemplateGridDto } from './IGetProjectTemplateGridDto';

export class ProjectTemplateRepository {
    public async CreateProjectTemplate(
        projectTemplate: ProjectTemplateEntity,
        queryRunner: QueryRunner,
    ): Promise<string> {
        const uid = projectTemplate.uid ?? DataUtilService.newUid();
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
                active_status: true,
            },
            loadRelationIds: true,
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
            'PT-O-'+FORMAT(prt.TemplateCode, '0000') AS TemplateCode,
            prt.TemplateCode as TemplateCodeRaw,
            prt.Subject AS Subject,
            wt.WorklistTypeDisplay as ProjectType,
            wt.WorklistType as ProjectTypeCode,
            pt.uid as ProjectTypeUid,
            prt.vessel_type_specific as VesselTypeSpecific,
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'ID', 'aliased.active_status = 1', 'VesselTypeId', {
                entity: className(ProjectTemplateVesselTypeEntity),
                alias: 'ptvt',
                on: 'ptvt.project_template_uid = prt.uid AND aliased.ID = ptvt.vessel_type_id',
            })},
            ${RepoUtils.getStringAggJoin(LibVesseltypes, 'VesselTypes', 'aliased.active_status = 1', 'VesselType', {
                entity: className(ProjectTemplateVesselTypeEntity),
                alias: 'ptvt',
                on: 'ptvt.project_template_uid = prt.uid AND aliased.ID = ptvt.vessel_type_id',
            })},
            COUNT(DISTINCT sj.standard_job_uid) as NoOfSpecItems,
            COALESCE(prt.updated_at, prt.created_at) as LastUpdated
            `,
            )
            .innerJoin(ProjectTypeEntity, 'pt', 'prt.ProjectTypeUid = pt.uid')
            .innerJoin(TecLibWorklistTypeEntity, 'wt', 'pt.WorklistType = wt.WorklistType')
            .innerJoin(ProjectTemplateVesselTypeEntity, 'ptvt', 'prt.uid = ptvt.project_template_uid')
            .leftJoin(
                ProjectTemplateStandardJobEntity,
                'sj',
                'prt.uid = sj.ProjectTemplateUid AND sj.active_status = 1',
            )
            .leftJoin(LibVesseltypes, 'vt', `vt.ID = ptvt.vessel_type_id and vt.Active_Status = 1`)
            .groupBy(
                [
                    'prt.uid',
                    'prt.template_code',
                    'prt.subject',
                    'prt.vessel_type_specific',
                    'pt.uid',
                    'COALESCE(prt.updated_at, prt.created_at)',
                    'wt.worklist_type_display',
                    'wt.worklist_type',
                ].join(','),
            )
            .where('prt.active_status = 1');

        if (filters.vesselTypeId?.length) {
            query = query.andWhere(`vt.ID IN (:...vesselTypeId)`, { vesselTypeId: filters.vesselTypeId });
        }

        const [sql, parameters] = query.getQueryAndParameters();

        const result = oDataService.getJoinResult(sql, parameters);

        return result;
    }

    public async updateProjectTemplateVesselTypes(
        uid: string,
        vesselTypeIds: number[],
        modifiedBy: string,
        queryRunner: QueryRunner,
    ) {
        const relations = await queryRunner.manager.findOne(ProjectTemplateEntity, {
            where: {
                uid,
            },
            relations: ['vesselType'],
        });

        const relationIds: number[] = relations?.vesselType.map((i) => i.ID) || [];
        const vesselTypes = Array.from(new Set([...relationIds, ...vesselTypeIds]));

        if (vesselTypes && vesselTypes.length) {
            const vesselTypesToDelete = relationIds.filter((item) => !vesselTypeIds.includes(item)) || [];

            const vesselTypesEntities = vesselTypes.map((id) => {
                const vesselType = new ProjectTemplateVesselTypeEntity();
                vesselType.vessel_type_id = id;
                vesselType.project_template_uid = uid;
                vesselType.active_status = vesselTypesToDelete.includes(id) ? false : true;
                vesselType.modified_by = modifiedBy;
                vesselType.modified_at = new Date();

                return vesselType;
            });

            await queryRunner.manager.save(ProjectTemplateVesselTypeEntity, vesselTypesEntities, {
                chunk: getChunkSize(5),
            });
        }
    }

    public async deleteProjectTemplate(
        uid: string,
        deletedBy: string,
        queryRunner: QueryRunner,
    ): Promise<UpdateResult> {
        return queryRunner.manager.update(
            ProjectTemplateEntity,
            { uid, active_status: true },
            {
                deleted_at: new Date(),
                deleted_by: deletedBy,
                active_status: false,
            },
        );
    }
}
