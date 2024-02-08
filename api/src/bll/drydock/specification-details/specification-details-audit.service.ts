import { DataUtilService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import {
    CreateFieldsHistoryDto,
    FieldsHistoryRepository,
} from '../../../dal/drydock/fields-history/FieldsHistoryRepository';
import { TaskManagerConstants } from '../../../shared/constants';

export class SpecificationDetailsAuditService {
    private readonly fieldsHistoryRepository = new FieldsHistoryRepository();

    public async auditCreatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
        createdById: string,
        queryRunner: QueryRunner,
    ): Promise<string[]> {
        const fields: CreateFieldsHistoryDto[] = this.generateFieldsData(specificationDetail, createdById);

        await this.fieldsHistoryRepository.insertMany(fields as CreateFieldsHistoryDto[], queryRunner);
        return fields.map((i) => i.uid);
    }

    public async auditManyCreatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto[],
        createdById: string,
        queryRunner: QueryRunner,
    ) {
        const fields: CreateFieldsHistoryDto[] = [];
        specificationDetail.forEach((specification) => {
            fields.push(...this.generateFieldsData(specification, createdById));
        });

        const maxParamsPerRequest = 2100;

        const flatFields = fields.flat();

        const batchLength = maxParamsPerRequest / (Object.keys(flatFields[0]).length * 2);

        if (flatFields.length >= batchLength) {
            while (flatFields.length > 0) {
                const batchedFields = flatFields.splice(0, Math.floor(batchLength));

                await this.fieldsHistoryRepository.insertMany(batchedFields as CreateFieldsHistoryDto[], queryRunner);
            }
        } else {
            await this.fieldsHistoryRepository.insertMany(flatFields as CreateFieldsHistoryDto[], queryRunner);
        }

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

    private generateFieldsData(
        specificationDetail: UpdateSpecificationDetailsDto,
        createdById: string,
    ): CreateFieldsHistoryDto[] {
        const now = new Date();
        return Object.entries(specificationDetail).map(([key, value]) => ({
            ...this.generateCommonFields(specificationDetail.uid),
            uid: DataUtilService.newUid(),
            displayText: key,
            value: value,
            actionName: 'Created',
            createdDate: now,
            createdBy: createdById,
        })) as CreateFieldsHistoryDto[];
    }

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
}
