import _ from 'lodash';

import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    GetStandardJobsResult,
    GetStandardJobsResultDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { GetStandardJobSubItemsResultDto } from '../../../application-layer/drydock/standard-jobs/dto/GetStandardJobSubItemsResultDto';
import { LIB_Survey_CertificateAuthority } from '../../../entity/LIB_Survey_CertificateAuthority';
import { LIB_VESSELTYPES } from '../../../entity/LIB_VESSELTYPES';
import { standard_jobs } from '../../../entity/standard_jobs';
import { standard_jobs_sub_items } from '../../../entity/standard_jobs_sub_items';

export class StandardJobsService {
    notSelectedValueLabel = '-';

    public mapStandardJobsDataToDto(
        queryData: GetStandardJobsQueryResult,
        subItems: standard_jobs_sub_items[],
    ): GetStandardJobsResultDto {
        const resultData: GetStandardJobsResult[] = queryData.records.map((standardJob) => {
            let newItem: GetStandardJobsResult = {
                uid: standardJob.uid,
                function: standardJob.function,
                functionUid: standardJob.functionUid,
                code: standardJob.code,
                scope: standardJob.scope,
                category: standardJob.category || this.notSelectedValueLabel,
                categoryUid: standardJob.categoryUid,
                doneBy: standardJob.doneBy || this.notSelectedValueLabel,
                doneByUid: standardJob.doneByUid,
                materialSuppliedBy: standardJob.materialSuppliedBy || this.notSelectedValueLabel,
                materialSuppliedByUid: standardJob.materialSuppliedByUid,
                vesselTypeSpecific: standardJob.vesselTypeSpecific,
                description: standardJob.description,
                activeStatus: standardJob.activeStatus,
                subject: {
                    innerHTML: '<p class="jb_grid_mainText">${standardJob.subject}</p>',
                    value: standardJob.subject,
                    cellStyle: '',
                },
                inspectionId: [],
                inspection: this.notSelectedValueLabel,
                vesselTypeId: [],
                vesselType: 'All',
                subItems: [],
            };

            if (standardJob.inspectionId) {
                const inspectionIds = standardJob.inspectionId.split(',').map(id => Number(id));
                const inspections = standardJob.inspection.split(',');
                newItem = {
                    ...newItem,
                    inspectionId: _.uniq(inspectionIds),
                    inspection: _.uniq(inspections).join(','),
                };
            }

            if (standardJob.vesselTypeId) {
                const vesselTypeIds = standardJob.vesselTypeId.split(',').map(id => Number(id));
                const vesselTypes = standardJob.vesselType.split(',');
                newItem = {
                    ...newItem,
                    vesselTypeId: _.uniq(vesselTypeIds),
                    vesselType: _.uniq(vesselTypes).join(','),
                };
            }

            if (standardJob.function && standardJob.subject) {
                newItem = {
                    ...newItem,
                    subject: {
                        innerHTML: `<p class="jb_grid_mainText">${standardJob.subject}</p><p class="jb_grid_subText">${standardJob.function}</p>`,
                        value: standardJob.subject,
                        cellStyle: '',
                    },
                };
            }

            return newItem;
        });

        if (subItems) {
            resultData.forEach((item) => {
                item.subItems = subItems
                    .filter((subItem) => subItem.standard_job_uid === item.uid)
                    .map((subItem) => {
                        return {
                            uid: subItem.uid,
                            code: subItem.code,
                            subject: subItem.subject,
                            description: subItem.description,
                            standard_job_uid: item.uid,
                        };
                    });
            });
        }

        return {
            records: resultData,
            count: queryData.count,
        };
    }

    public mapStandardJobsDtoToEntity(data: CreateStandardJobsRequestDto): Partial<standard_jobs> {
        const standardJob = new standard_jobs();
        standardJob.subject = data.subject;
        standardJob.code = data.code;
        standardJob.scope = data.scope;
        standardJob.function = data.function;
        standardJob.functionUid = data.functionUid;
        standardJob.vessel_type_specific = data.vesselTypeSpecific;
        standardJob.description = data.description;
        if (data.categoryUid) {
            standardJob.category = {
                uid: data.categoryUid,
            };
        }
        if (data.doneByUid) {
            standardJob.done_by = {
                uid: data.doneByUid,
            };
        }
        if (data.materialSuppliedByUid) {
            standardJob.material_supplied_by = {
                uid: data.materialSuppliedByUid,
            };
        }
        if (data.inspectionId) {
            standardJob.inspection = data.inspectionId.map((id) => {
                const surveyCertificateAuthority = new LIB_Survey_CertificateAuthority();
                surveyCertificateAuthority.ID = id;

                return surveyCertificateAuthority;
            });
        }
        if (data.vesselTypeId) {
            standardJob.vessel_type = data.vesselTypeId.map((id) => {
                const vesselType = new LIB_VESSELTYPES();
                vesselType.ID = id;

                return vesselType;
            });
        }

        return _.omitBy(standardJob, _.isUndefined);
    }

    public mapStandardJobSubItemsDtoToEntity(
        data: GetStandardJobSubItemsResultDto[],
        standardJobUid: string,
        createdBy: string,
    ): standard_jobs_sub_items[] {
        return data.map((itemData) => {
            let subItem = new standard_jobs_sub_items();
            subItem.uid = itemData.uid;
            subItem.code = itemData.code;
            subItem.subject = itemData.subject;
            subItem.description = itemData.description;
            subItem.standard_job = {
                uid: standardJobUid,
            };
            if (!itemData.uid) {
                subItem = this.addCreateStandardJobsFields(subItem, createdBy);
            } else {
                subItem = this.addUpdateStandardJobsFields(subItem, createdBy);
            }

            return subItem;
        });
    }

    public addUpdateStandardJobsFields<T extends { updated_at?: Date; updated_by?: string }>(
        data: T,
        updatedBy: string,
    ): T {
        return {
            ...data,
            updated_at: new Date(),
            updated_by: updatedBy,
        };
    }

    public addCreateStandardJobsFields<T extends { created_at?: Date; created_by?: string }>(
        data: T,
        updatedBy: string,
    ): T {
        return {
            ...data,
            created_at: new Date(),
            created_by: updatedBy,
        };
    }

    public addDeleteStandardJobsFields(deletedBy: string) {
        return {
            active_status: false,
            deleted_at: new Date(),
            deleted_by: deletedBy,
        };
    }
}
