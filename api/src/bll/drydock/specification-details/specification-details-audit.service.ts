import { DataUtilService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import {
    CreateFieldsHistoryDto,
    FieldsHistoryRepository,
} from '../../../dal/drydock/fields-history/FieldsHistoryRepository';
import { TaskManagerConstants } from '../../../shared/constants/task-manager';

export class SpecificationDetailsAuditService {
    private readonly fieldsHistoryRepository = new FieldsHistoryRepository();

    private generateCommonFields(uid: string): Partial<CreateFieldsHistoryDto> {
        return {
            key1: uid,
            key2: '0',
            key3: '',
            moduleCode: TaskManagerConstants.project.module_code,
            functionCode: TaskManagerConstants.project.function_code,
            isCurrent: true,
            versionNumber: 1,
            tableName: 'specification_details',
            section: 'Header Section',
        };
    }

    public async auditCreatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
        createdById: string,
        queryRunner: QueryRunner,
    ): Promise<string[]> {
        const now = new Date();
        const fields = Object.entries(specificationDetail).map(([key, value]) => ({
            uid: DataUtilService.newUid(),
            ...this.generateCommonFields(specificationDetail.uid),
            displayText: key,
            value: value,
            actionName: 'Created',
            createdDate: now,
            createdBy: createdById,
        }));

        await this.fieldsHistoryRepository.insertMany(fields as CreateFieldsHistoryDto[], queryRunner);
        return fields.map((i) => i.uid);
    }

    public async auditDeletedSpecificationDetails(
        uid: string,
        deletedById: string,
        queryRunner: QueryRunner,
    ): Promise<string> {
        const deleteField = {
            uid: DataUtilService.newUid(),
            ...this.generateCommonFields(uid),
            actionName: 'Deleted',
            createdBy: deletedById,
        };

        await this.fieldsHistoryRepository.saveFieldsHistory(deleteField as CreateFieldsHistoryDto, queryRunner);
        return deleteField.uid;
    }

    public async auditUpdatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
        updatedById: string,
        queryRunner: QueryRunner,
    ): Promise<string[]> {
        const now = new Date();
        const fields = Object.entries(specificationDetail).map(([key, value]) => ({
            uid: DataUtilService.newUid(),
            ...this.generateCommonFields(specificationDetail.uid),
            displayText: key,
            value: value,
            actionName: 'Amended',
            createdDate: now,
            createdBy: updatedById,
        }));

        await this.fieldsHistoryRepository.insertMany(fields as CreateFieldsHistoryDto[], queryRunner);
        return fields.map((i) => i.uid);
    }
}
