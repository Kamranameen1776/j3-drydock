import { getConnection, QueryRunner } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import {
    LibVesselsEntity,
    ProjectEntity,
    SpecificationDetailsEntity,
    StatementOfFactsEntity,
} from '../../../entity/drydock';

export class VesselsRepository {
    public async GetVessel(
        vesselId: number,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<LibVesselsEntity> {
        const vesselRepository = queryRunner.manager.getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                VesselId: vesselId,
            },
        });

        return data;
    }

    public async GetVesselByUID(
        vesselUID: string,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<LibVesselsEntity> {
        const vesselRepository = queryRunner.manager.getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                uid: vesselUID,
            },
        });

        return data;
    }

    public async GetVesselByProjectUid(
        projectUid: string,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<LibVesselsEntity> {
        const projectRepository = queryRunner.manager.getRepository(ProjectEntity);
        const project = await projectRepository.findOneOrFail({
            where: {
                uid: projectUid,
            },
        });
        return this.GetVesselByUID(project.VesselUid);
    }

    public async GetVesselByStatementOfFact(
        uid: string,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<LibVesselsEntity> {
        const specificationRepository = queryRunner.manager.getRepository(StatementOfFactsEntity);

        const res = await specificationRepository
            .createQueryBuilder('sof')
            .select(['sof.uid as uid', 'proj.VesselUid AS VesselUid'])
            .innerJoin(className(ProjectEntity), 'proj', 'sof.ProjectUid = proj.uid')
            .where('sof.ActiveStatus = 1')
            .andWhere('sof.uid = :uid', { uid })
            .getRawOne();
        return this.GetVesselByUID(res.VesselUid, queryRunner);
    }

    public async GetVesselBySpecification(
        uid: string,
        queryRunner: QueryRunner = getConnection().createQueryRunner(),
    ): Promise<LibVesselsEntity> {
        const specificationRepository = queryRunner.manager.getRepository(SpecificationDetailsEntity);

        const res = await specificationRepository
            .createQueryBuilder('spec')
            .select(['spec.uid as uid', 'proj.VesselUid AS VesselUid'])
            .innerJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .getRawOne();
        return this.GetVesselByUID(res.VesselUid, queryRunner);
    }
}
