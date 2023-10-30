import {
    CreateStandardJobsRequestDto,
    GetStandardJobsResult,
    GetStandardJobsResultDto,
} from '../../../application-layer/drydock/standard-jobs/dto';
import { standard_jobs } from '../../../entity/standard_jobs';
import _ from 'lodash';
import { LIB_VESSELTYPES } from '../../../entity/LIB_VESSELTYPES';
import { LIB_Survey_CertificateAuthority } from '../../../entity/LIB_Survey_CertificateAuthority';

export class StandardJobsService {
    public mapStandardJobsDataToDto(queryData: standard_jobs[]): GetStandardJobsResultDto {
        let resultData: GetStandardJobsResult[] = queryData.map((standardJob) => {
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
                newItem.inspection = standardJob.inspection.map((itm) => itm.Authority).join(', ');
                newItem.inspectionId = standardJob.inspection.map((itm) => itm.ID) as number[];
            }
            if (standardJob.vessel_type) {
                newItem.vesselType = standardJob.vessel_type.map((itm) => itm.VesselTypes).join(', ');
                newItem.vesselTypeId = standardJob.vessel_type.map((itm) => itm.ID) as number[];
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

    public addUpdateStandardJobsFields(data: Partial<standard_jobs>, updatedBy: string): Partial<standard_jobs> {
        return {
            ...data,
            updated_at: new Date(),
            updated_by: updatedBy,
        };
    }

    public addDeleteStandardJobsFields(deletedBy: string): Partial<standard_jobs> {
        return {
            active_status: false,
            deleted_at: new Date(),
            deleted_by: deletedBy,
        };
    }
}
