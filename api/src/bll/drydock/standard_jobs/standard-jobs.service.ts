import _ from 'lodash';

import {
    CreateStandardJobsRequestDto,
    GetStandardJobsQueryResult,
    GetStandardJobsResult,
    GetStandardJobsResultDto,
    GetStandardJobSubItemsResultDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { StandardJobs, StandardJobsSubItems } from '../../../entity/drydock';
import { QueryStrings } from '../../../shared/enum/queryStrings.enum';

export class StandardJobsService {
    notSelectedValueLabel = '-';

    public mapStandardJobsDataToDto(
        queryData: GetStandardJobsQueryResult,
        subItems: StandardJobsSubItems[],
    ): GetStandardJobsResultDto {
        const resultData: GetStandardJobsResult[] = queryData.records.map((standardJob) => {
            let newItem: GetStandardJobsResult = {
                uid: standardJob.uid,
                function: standardJob.function,
                functionUid: standardJob.functionUid,
                code: standardJob.code,
                number: standardJob.number,
                estimatedBudget: standardJob.estimatedBudget,
                estimatedDuration: standardJob.estimatedDuration,
                bufferTime: standardJob.bufferTime,
                jobRequired: standardJob.jobRequired,
                jobExecutionUid: standardJob.jobExecutionUid,
                glAccountUid: standardJob.glAccountUid,
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
                hasSubItems: standardJob.hasSubItems,
                hasInspection: standardJob.hasInspection,
            };

            if (standardJob.inspectionId) {
                const inspectionIds = standardJob.inspectionId.split(',').map((id) => Number(id));
                const inspections = standardJob.inspection.split(',');
                newItem = {
                    ...newItem,
                    inspectionId: _.uniq(inspectionIds),
                    inspection: _.uniq(inspections).join(','),
                };
            }

            if (standardJob.vesselTypeId) {
                const vesselTypeIds = standardJob.vesselTypeId.split(',').map((id) => Number(id));
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
                    .filter((subItem) => subItem.standardJobUid === item.uid)
                    .map((subItem) => {
                        return {
                            uid: subItem.uid,
                            code: subItem.code,
                            subject: subItem.subject,
                            description: subItem.description,
                            standardJobUid: item.uid,
                        };
                    });
            });
        }

        return {
            records: resultData,
            count: queryData.count,
        };
    }

    public mapStandardJobsDtoToEntity(data: CreateStandardJobsRequestDto): Partial<StandardJobs> {
        const standardJob = new StandardJobs();
        standardJob.subject = data.subject;
        standardJob.scope = data.scope;
        standardJob.function = data.function;
        standardJob.functionUid = data.functionUid;
        standardJob.vesselTypeSpecific = data.vesselTypeSpecific;
        standardJob.description = data.description;
        standardJob.number = data.number;
        standardJob.code = data.code;
        standardJob.jobRequired = data.jobRequired;
        standardJob.estimatedBudget = data.estimatedBudget;
        standardJob.estimatedDuration = data.estimatedDuration;
        standardJob.bufferTime = data.bufferTime;
        standardJob.jobExecutionUid = data.jobExecutionUid;
        standardJob.glAccountUid = data.glAccountUid;

        if ('doneByUid' in data) {
            standardJob.doneBy = {
                uid: data.doneByUid,
            };
        }
        if ('materialSuppliedByUid' in data) {
            standardJob.materialSuppliedBy = {
                uid: data.materialSuppliedByUid,
            };
        }

        return _.omitBy(standardJob, _.isUndefined);
    }

    public mapStandardJobSubItemsDtoToEntity(
        data: GetStandardJobSubItemsResultDto[],
        standardJobUid: string,
        createdBy: string,
    ): StandardJobsSubItems[] {
        return data.map((itemData) => {
            let subItem = new StandardJobsSubItems();
            subItem.uid = itemData.uid;
            subItem.code = itemData.code;
            subItem.subject = itemData.subject;
            subItem.description = itemData.description;
            subItem.standardJob = {
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

    public addUpdateStandardJobsFields<
        T extends {
            updated_at?: Date;
            updated_by?: string;
        },
    >(data: T, updatedBy: string): T {
        return {
            ...data,
            updated_at: new Date(),
            updated_by: updatedBy,
        };
    }

    public addCreateStandardJobsFields<
        T extends {
            created_at?: Date;
            created_by?: string;
        },
    >(data: T, updatedBy: string): T {
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
