import { getManager, Repository } from 'typeorm';

import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { J2FieldsHistory } from '../../../entity/j2_fields_history';
import { TaskManagerConstants } from '../../../shared/constants/task-manager';

export class SpecificationDetailsAuditService {
    private readonly fieldsHistoryRepository: Repository<J2FieldsHistory> = getManager().getRepository(J2FieldsHistory);
    private readonly specificationDetailsRepository: SpecificationDetailsRepository =
        new SpecificationDetailsRepository();

    private generateCommonFields(uid: string): Partial<J2FieldsHistory> {
        return {
            key_1: uid,
            key_2: '0',
            key_3: '',
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            is_current: true,
            version_number: 1,
            table_name: 'specification_details',
            section: 'Header Section',
        };
    }

    public async auditCreatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
        createdById: string,
    ): Promise<void> {
        const now = new Date();
        const fields = Object.entries(specificationDetail).map(([key, value]) => ({
            ...this.generateCommonFields(specificationDetail.uid),
            display_text: key,
            value: value,
            action_name: 'Created',
            created_date: now,
            created_by: createdById,
        }));

        await this.fieldsHistoryRepository.insert(fields as J2FieldsHistory[]);
    }

    public async auditDeletedSpecificationDetails(uid: string, deletedById: string): Promise<void> {
        const deleteField = {
            ...this.generateCommonFields(uid),
            action_name: 'Deleted',
            created_by: deletedById,
        };

        await this.fieldsHistoryRepository.save(deleteField as J2FieldsHistory);
    }

    public async auditUpdatedSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
        updatedById: string,
    ): Promise<void> {
        const now = new Date();
        const fields = Object.entries(specificationDetail).map(([key, value]) => ({
            ...this.generateCommonFields(specificationDetail.uid),
            display_text: key,
            value: value,
            action_name: 'Amended',
            created_date: now,
            created_by: updatedById,
        }));

        await this.fieldsHistoryRepository.insert(fields as J2FieldsHistory[]);
    }
}
