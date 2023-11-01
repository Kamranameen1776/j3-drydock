import {
    CreateStandardJobsRequestDto,
    GetStandardJobsResult,
    GetStandardJobsResultDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import _ from 'lodash';
import { LIB_VESSELTYPES } from '../../../entity/LIB_VESSELTYPES';
import { LIB_Survey_CertificateAuthority } from '../../../entity/LIB_Survey_CertificateAuthority';
import { standard_jobs_sub_items } from "../../../entity/standard_jobs_sub_items";
import {
    GetStandardJobSubItemsResultDto
} from "../../../application-layer/drydock/standard-jobs/dto/GetStandardJobSubItemsResultDto";

export class StandardJobsService {
    public mapStandardJobsDataToDto(queryData: standard_jobs[]): GetStandardJobsResultDto {
        const resultData: GetStandardJobsResult[] = queryData.map((standardJob) => {
            let newItem: GetStandardJobsResult = {
                uid: standardJob.uid,
                function: standardJob.function,
                code: standardJob.code,
                scope: standardJob.scope,
                category: standardJob.category?.display_name,
                categoryUid: standardJob.category_uid,
                doneBy: standardJob.done_by?.displayName,
                doneByUid: standardJob.done_by_uid,
                materialSuppliedBy: standardJob.material_supplied_by?.display_name,
                materialSuppliedByUid: standardJob.material_supplied_by_uid,
                vesselTypeSpecific: standardJob.vessel_type_specific,
                description: standardJob.description,
                activeStatus: standardJob.active_status,
                subject: {
                    innerHTML: '<p class="jb_grid_mainText">${standardJob.subject}</p>',
                    value: standardJob.subject,
                    cellStyle: '',
                },
                inspectionId: [],
                inspection: '',
                vesselTypeId: [],
                vesselType: '',
                subItems: this.getActiveItems(standardJob.sub_items),
            };


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

            if (standardJob.inspection) {
                const inspections = this.getActiveItems(standardJob.inspection, 'Active_Status');
                newItem.inspection = inspections.map((itm) => itm.Authority).join(', ');
                newItem.inspectionId = inspections.map((itm) => itm.ID) as number[];
            }
            if (standardJob.vessel_type) {
                const vesselTypes = this.getActiveItems(standardJob.vessel_type, 'Active_Status');
                newItem.vesselType = vesselTypes.map((itm) => itm.VesselTypes).join(', ');
                newItem.vesselTypeId = vesselTypes.map((itm) => itm.ID) as number[];
            }

            return newItem;
        });

        return {
            records: resultData,
            count: resultData.length,
        };
    }

    public mapStandardJobsDtoToEntity(data: CreateStandardJobsRequestDto): Partial<standard_jobs> {
        const standardJob = new standard_jobs();
        standardJob.subject = data.subject;
        standardJob.code = data.code;
        standardJob.scope = data.scope;
        standardJob.category = {
            uid: data.categoryUid,
        };
        standardJob.function = data.function;
        standardJob.done_by = {
            uid: data.doneByUid,
        };
        standardJob.material_supplied_by = {
            uid: data.materialSuppliedByUid,
        };
        standardJob.vessel_type_specific = data.vesselTypeSpecific;
        standardJob.description = data.description;
        standardJob.inspection = data.inspectionId.map((id) => {
            const surveyCertificateAuthority = new LIB_Survey_CertificateAuthority();
            surveyCertificateAuthority.ID = id;

            return surveyCertificateAuthority;
        });
        standardJob.vessel_type = data.vesselTypeId.map((id) => {
            const vesselType = new LIB_VESSELTYPES();
            vesselType.ID = id;

            return vesselType;
        });

        return _.omitBy(standardJob, _.isUndefined);
    }

    public mapStandardJobSubItemsDtoToEntity(
      data: GetStandardJobSubItemsResultDto[],
      standardJobUid: string,
      createdBy: string,
    ): standard_jobs_sub_items[] {
        return data.map(itemData => {
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

    public addUpdateStandardJobsFields<T extends { updated_at?: Date; updated_by?: string; }>(data: T, updatedBy: string): T {
        return {
            ...data,
            updated_at: new Date(),
            updated_by: updatedBy,
        };
    }

    public addCreateStandardJobsFields<T extends { created_at?: Date; created_by?: string; }>(data: T, updatedBy: string): T {
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

    private getActiveItems<T extends {}>(items: T[], key: keyof T): T[]
    private getActiveItems<T extends { active_status: boolean }>(items: T[]): T[]
    private getActiveItems<T extends { active_status: boolean }>(items: T[], key: keyof T = 'active_status'): T[] {
        return items.filter((item) => item[key]);
    }
}
