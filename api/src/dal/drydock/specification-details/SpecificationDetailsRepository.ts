import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { SpecificationDetailsEntity } from '../../../entity/SpecificationDetailsEntity';
import { ICreateSpecificationDetailsDto } from './dtos/ICreateSpecificationDetailsDto';
import { ISpecificationDetailsResultDto } from './dtos/ISpecificationDetailsResultDto';
import { IUpdateSpecificationDetailsDto } from './dtos/IUpdateSpecificationDetailsDto';

export class SpecificationDetailsRepository {
    public async findOneBySpecificationUid(uid: string): Promise<ISpecificationDetailsResultDto> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);

        return await specificationRepository
            .createQueryBuilder('spec')
            .select(
                `spec.uid as uid,
               spec.TecTaskManagerUid as tmTask,
               spec.FunctionUid as functionUid,
               spec.ComponentUid as componentUid,
               spec.AccountCode as accountCode,
               spec.ItemSourceUid as itemSourceUid,
               spec.ItemNumber as itemNumber,
               spec.DoneByUid as doneByUid,
               spec.ItemCategoryUid as itemCategoryUid,
               spec.InspectionUid as inspectionUid,
               spec.EquipmentDescription as equipmentDescription,
               spec.PriorityUid as priorityUid,
               spec.Description as description,
               spec.StartDate as startDate,
               spec.EstimatedDays as estimatedDays,
               spec.BufferTime as bufferTime,
               spec.Treatment as treatment,
               spec.OnboardLocationUid as onboardLocationUid,
               spec.Access as access,
               spec.MaterialSuppliedByUid as materialSuppliedByUid,
               spec.TestCriteria as testCriteria,
               spec.Ppe as ppe,
               spec.SafetyInstruction as safetyInstruction,
               spec.ActiveStatus as activeStatus,
               spec.CreatedByUid as createdBy,
               spec.CreatedAt as createdAt
               `,
            )
            .where(`spec.ActiveStatus = 1 and spec.uid='${uid}'`)
            .execute();
    }

    public async CreateSpecificationDetails(data: ICreateSpecificationDetailsDto, queryRunner: QueryRunner) {
        const spec = await this.upsertSpecification(data);
        spec.CreatedAt = new Date();
        spec.ActiveStatus = true;
        return await queryRunner.manager.insert(SpecificationDetailsEntity, spec);
    }

    public async UpdateSpecificationDetails(data: IUpdateSpecificationDetailsDto, queryRunner: QueryRunner) {
        const spec = await this.upsertSpecification(data);
        return await queryRunner.manager.update(SpecificationDetailsEntity, spec.uid, spec);
    }

    public async DeleteSpecificationDetails(uid: string, queryRunner: QueryRunner) {
        const spec = new SpecificationDetailsEntity();
        spec.ActiveStatus = false;
        return await queryRunner.manager.update(SpecificationDetailsEntity, uid, spec);
    }

    private async upsertSpecification(data: ICreateSpecificationDetailsDto | IUpdateSpecificationDetailsDto) {
        const spec = new SpecificationDetailsEntity();
        spec.uid = data?.uid ? data.uid : new DataUtilService().newUid();
        spec.TecTaskManagerUid = data.tmTask;
        spec.FunctionUid = data.functionUid;
        spec.ComponentUid = data.componentUid;
        spec.AccountCode = data.accountCode;
        spec.ItemSourceUid = data.itemSourceUid;
        spec.ItemNumber = data.itemNumber;
        spec.DoneByUid = data.doneByUid;
        spec.ItemCategoryUid = data.itemCategoryUid;
        spec.InspectionUid = data.inspectionUid;
        spec.EquipmentDescription = data.equipmentDescription;
        spec.PriorityUid = data.priorityUid;
        spec.Description = data.description;
        spec.StartDate = data.startDate;
        spec.EstimatedDays = data.estimatedDays;
        spec.BufferTime = data.bufferTime;
        spec.Treatment = data.treatment;
        spec.OnboardLocationUid = data.onboardLocationUid;
        spec.Access = data.access;
        spec.MaterialSuppliedByUid = data.materialSuppliedByUid;
        spec.TestCriteria = data.testCriteria;
        spec.Ppe = data.ppe;
        spec.SafetyInstruction = data.safetyInstruction;
        return spec;
    }
}
