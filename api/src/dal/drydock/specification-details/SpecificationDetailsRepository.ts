import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { SpecificationDetailsEntity } from '../../../entity/SpecificationDetailsEntity';
import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class SpecificationDetailsRepository {
    public async findOneBySpecificationUid(uid: string): Promise<GetSpecificationDetailsResultDto[]> {
        const specificationRepository = getManager().getRepository(SpecificationDetailsEntity);

        return await specificationRepository
            .createQueryBuilder()
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
               spec.CreatedBy as createdBy,
               spec.CreatedAt as createdAt
               `,
            )
            .where(`spec.active_status = 1 and spec.uid='${uid}'`)
            .getRawMany();
    }

    public async CreateSpecificationDetails(data: GetSpecificationDetailsResultDto, queryRunner: QueryRunner) {
        const spec = await this.specData(data);
        spec.CreatedAt = new Date();
        spec.ActiveStatus = true;
        return await queryRunner.manager.insert(SpecificationDetailsEntity, spec);
    }

    public async UpdateSpecificationDetails(data: GetSpecificationDetailsResultDto, queryRunner: QueryRunner) {
        const spec = await this.specData(data);
        return await queryRunner.manager.update(SpecificationDetailsEntity, spec.uid, spec);
    }

    public async DeleteSpecificationDetails(uid: string, queryRunner: QueryRunner) {
        const spec = new SpecificationDetailsEntity();
        spec.ActiveStatus = false;
        return await queryRunner.manager.update(SpecificationDetailsEntity, uid, spec);
    }

    public async specData(data: GetSpecificationDetailsResultDto) {
        const spec = new SpecificationDetailsEntity();
        spec.uid = data?.uid ? data.uid : new DataUtilService().newUid();
        spec.TecTaskManagerUid = data?.tmTask ? data.tmTask : '';
        spec.FunctionUid = data?.functionUid ? data.functionUid : '';
        spec.ComponentUid = data?.componentUid ? data.componentUid : '';
        spec.AccountCode = data?.accountCode ? data.accountCode : '';
        spec.ItemSourceUid = data?.itemSourceUid ? data.itemSourceUid : '';
        spec.ItemNumber = data?.itemNumber ? data.itemNumber : '';
        spec.DoneByUid = data?.doneByUid ? data.doneByUid : '';
        spec.ItemCategoryUid = data?.itemCategoryUid ? data.itemCategoryUid : '';
        spec.InspectionUid = data?.inspectionUid ? data.inspectionUid : '';
        spec.EquipmentDescription = data?.equipmentDescription ? data.equipmentDescription : '';
        spec.PriorityUid = data?.priorityUid ? data.priorityUid : '';
        spec.Description = data?.description ? data.description : '';
        spec.StartDate = data?.startDate ? data.startDate : new Date();
        spec.EstimatedDays = data?.estimatedDays ? data.estimatedDays : 0;
        spec.BufferTime = data?.bufferTime ? data.bufferTime : 0;
        spec.Treatment = data?.treatment ? data.treatment : '';
        spec.OnboardLocationUid = data?.onboardLocationUid ? data.onboardLocationUid : '';
        spec.Access = data?.access ? data.access : '';
        spec.MaterialSuppliedByUid = data.materialSuppliedByUid;
        spec.TestCriteria = data.testCriteria;
        spec.Ppe = data.ppe;
        spec.SafetyInstruction = data.safetyInstruction;
        return spec;
    }
}
