import { getManager, Repository } from 'typeorm';

import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { ISpecificationDetailsResultDto } from '../../../dal/drydock/specification-details/dtos';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { J2FieldsHistory, J2FieldsHistoryKeys } from '../../../entity/j2_fields_history';
import { TaskManagerConstants } from '../../../shared/constants/task-manager';

export class SpecificationDetailsAuditService {
    private readonly fieldsHistoryRepository: Repository<J2FieldsHistory> = getManager().getRepository(J2FieldsHistory);
    private readonly specificationDetailsRepository: SpecificationDetailsRepository =
        new SpecificationDetailsRepository();

    private keysFromSpecificationDetails(SpecificationDetails: UpdateSpecificationDetailsDto): J2FieldsHistoryKeys {
        return {
            key_1: 'specification_details',
            key_2: SpecificationDetails.uid,
            key_3: '',
        };
    }

    private fieldsFromCreateSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
    ): Partial<J2FieldsHistory> {
        return {
            key_1: specificationDetail.uid,
            key_3: '',
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            created_by: '', // TODO: add created by
            created_date: new Date(), // TODO: add created date
            is_current: true,
            version_number: 1,
            table_name: 'specification_details',
            display_text: 'Specification Details Created',
            value: '', // TODO: add value
            column_name: '', // TODO: add column name
        };
    }

    private fieldsFromUpdateSpecificationDetails(
        specificationDetail: UpdateSpecificationDetailsDto,
    ): Partial<J2FieldsHistory> {
        return {
            key_1: 'specification_details',
            key_2: specificationDetail.uid,
            key_3: '',
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            modified_date: new Date(),
            is_current: true,
            version_number: 1,
            table_name: 'specification_details',
            display_text: 'Specification Details Updated',
            value: '', // TODO: add value
            column_name: '', // TODO: add column name
        };
    }

    private fieldsFromDeleteSpecificationDetails(
        specificationDetail: ISpecificationDetailsResultDto,
    ): Partial<J2FieldsHistory> {
        return {
            key_1: 'specification_details',
            key_2: specificationDetail.uid,
            key_3: '',
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            modified_date: new Date(),
            is_current: true,
            version_number: 1,
            table_name: 'specification_details',
            display_text: 'Specification Details Deleted',
            value: '', // TODO: add value
            column_name: '', // TODO: add column name
        };
    }

    public async auditCreatedSpecificationDetails(specificationDetail: UpdateSpecificationDetailsDto): Promise<void> {
        await this.fieldsHistoryRepository.save({
            ...this.fieldsFromCreateSpecificationDetails(specificationDetail),
            action_name: 'CREATE',
        });
    }

    public async auditDeletedSpecificationDetails(uid: string): Promise<void> {
        const [specificationDetail] = await this.specificationDetailsRepository.findOneBySpecificationUid(uid);
        if (specificationDetail) {
            await this.fieldsHistoryRepository.save({
                ...this.fieldsFromDeleteSpecificationDetails(specificationDetail),
                action_name: 'DELETE',
            });
        }
    }

    public async auditUpdatedSpecificationDetails(specificationDetail: UpdateSpecificationDetailsDto): Promise<void> {
        const keys = this.keysFromSpecificationDetails(specificationDetail);

        const exists = await this.fieldsHistoryRepository.findOne({ where: keys });

        if (!exists) {
            await this.fieldsHistoryRepository.save({
                ...this.fieldsFromUpdateSpecificationDetails(specificationDetail),
                action_name: 'UPDATE',
            });
        }
    }
}
