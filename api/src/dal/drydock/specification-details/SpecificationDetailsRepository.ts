import { DataUtilService } from 'j2utils';
import { getManager, QueryRunner } from 'typeorm';

import { SpecificationDetailsEntity } from '../../../entity/SpecificationDetailsEntity';
import { GetSpecificationDetailsResultDto } from './dtos/GetSpecificationDetailsResultDto';

export class SpecificationDetailsRepository {
    public async findOneBySpecificationUid(uid: string): Promise<GetSpecificationDetailsResultDto[]> {
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
        const existingSpec = await getManager().findOne(SpecificationDetailsEntity, {
            where: { uid: data.uid, ActiveStatus: 1 },
        });
        const spec = new SpecificationDetailsEntity();
        spec.uid = data?.uid ? data.uid : new DataUtilService().newUid();
        spec.TecTaskManagerUid = data?.tmTask
            ? data.tmTask
            : existingSpec?.TecTaskManagerUid
            ? existingSpec.TecTaskManagerUid
            : '';
        spec.FunctionUid = data?.functionUid
            ? data.functionUid
            : existingSpec?.FunctionUid
            ? existingSpec.FunctionUid
            : '';
        spec.ComponentUid = data?.componentUid
            ? data.componentUid
            : existingSpec?.ComponentUid
            ? existingSpec.ComponentUid
            : '';
        spec.AccountCode = data?.accountCode
            ? data.accountCode
            : existingSpec?.AccountCode
            ? existingSpec.AccountCode
            : '';
        spec.ItemSourceUid = data?.itemSourceUid
            ? data.itemSourceUid
            : existingSpec?.ItemSourceUid
            ? existingSpec.ItemSourceUid
            : '';
        spec.ItemNumber = data?.itemNumber ? data.itemNumber : existingSpec?.ItemNumber ? existingSpec.ItemNumber : '';
        spec.DoneByUid = data?.doneByUid ? data.doneByUid : existingSpec?.DoneByUid ? existingSpec.DoneByUid : '';
        spec.ItemCategoryUid = data?.itemCategoryUid
            ? data.itemCategoryUid
            : existingSpec?.ItemCategoryUid
            ? existingSpec.ItemCategoryUid
            : '';
        spec.InspectionUid = data?.inspectionUid
            ? data.inspectionUid
            : existingSpec?.InspectionUid
            ? existingSpec.InspectionUid
            : '';
        spec.EquipmentDescription = data?.equipmentDescription
            ? data.equipmentDescription
            : existingSpec?.EquipmentDescription
            ? existingSpec.EquipmentDescription
            : '';
        spec.PriorityUid = data?.priorityUid
            ? data.priorityUid
            : existingSpec?.PriorityUid
            ? existingSpec.PriorityUid
            : '';
        spec.Description = data?.description
            ? data.description
            : existingSpec?.Description
            ? existingSpec.Description
            : '';
        spec.StartDate = data?.startDate ? data.startDate : existingSpec?.StartDate ? existingSpec.StartDate : null;
        spec.EstimatedDays = data?.estimatedDays
            ? data.estimatedDays
            : existingSpec?.EstimatedDays
            ? existingSpec.EstimatedDays
            : 0;
        spec.BufferTime = data?.bufferTime ? data.bufferTime : existingSpec?.BufferTime ? existingSpec.BufferTime : 0;
        spec.Treatment = data?.treatment ? data.treatment : existingSpec?.Treatment ? existingSpec.Treatment : '';
        spec.OnboardLocationUid = data?.onboardLocationUid
            ? data.onboardLocationUid
            : existingSpec?.OnboardLocationUid
            ? existingSpec.OnboardLocationUid
            : '';
        spec.Access = data?.access ? data?.access : existingSpec?.Access ? existingSpec.Access : '';
        spec.MaterialSuppliedByUid = data?.materialSuppliedByUid
            ? data.materialSuppliedByUid
            : existingSpec?.MaterialSuppliedByUid
            ? existingSpec.MaterialSuppliedByUid
            : '';
        spec.TestCriteria = data?.testCriteria
            ? data.testCriteria
            : existingSpec?.TestCriteria
            ? existingSpec.TestCriteria
            : '';
        spec.Ppe = data.ppe;
        spec.SafetyInstruction = data.safetyInstruction;
        return spec;
    }
}
