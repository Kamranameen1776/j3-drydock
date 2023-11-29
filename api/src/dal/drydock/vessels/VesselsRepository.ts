import { getManager } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { ProjectEntity, SpecificationDetailsEntity, StatementOfFactsEntity } from '../../../entity/drydock';
import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';

export class VesselsRepository {
    public async GetVessel(vesselId: number): Promise<LibVesselsEntity> {
        const vesselRepository = getManager().getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                VesselId: vesselId,
            },
        });

        return data;
    }

    public async GetVesselByUID(vesselUID: string): Promise<LibVesselsEntity> {
        const vesselRepository = getManager().getRepository(LibVesselsEntity);

        const data = await vesselRepository.findOneOrFail({
            where: {
                uid: vesselUID,
            },
        });

        return data;
    }
    public async GetVesselByProjectUid(projectUid: string): Promise<LibVesselsEntity> {
        const projectRepository = getManager().getRepository(ProjectEntity);
        const project = await projectRepository.findOneOrFail({
            where: {
                uid: projectUid,
            },
        });
        return this.GetVesselByUID(project.VesselUid);
    }
    public async GetVesselByStatementOfFact(uid: string): Promise<LibVesselsEntity> {
        const specificationRepository = getManager().getRepository(StatementOfFactsEntity);

        const res = await specificationRepository
            .createQueryBuilder('sof')
            .select(['sof.uid as uid', 'proj.VesselUid AS VesselUid'])
            .innerJoin(className(ProjectEntity), 'proj', 'sof.ProjectUid = proj.uid')
            .where('sof.ActiveStatus = 1')
            .andWhere('sof.uid = :uid', { uid })
            .execute();
        return this.GetVesselByUID(res[0].VesselUid);
    }
    public async GetVesselBySpecification(uid: string): Promise<LibVesselsEntity> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);

        const res = await specificationRepository
            .createQueryBuilder('spec')
            .select(['spec.uid as uid', 'proj.VesselUid AS VesselUid'])
            .innerJoin(className(ProjectEntity), 'proj', 'spec.ProjectUid = proj.uid')
            .where('spec.ActiveStatus = 1')
            .andWhere('spec.uid = :uid', { uid })
            .execute();
        return this.GetVesselByUID(res[0].VesselUid);
    }
}
