import _ from 'lodash';

import {
    IGetProjectTemplateGridDto,
    IGetProjectTemplateGridDtoResult,
    IGetProjectTemplateGridQueryResult,
} from '../../../dal/drydock/ProjectTemplate/IGetProjectTemplateGridDto';
import {
    IGetProjectTemplateStandardJobsGridDto,
    IGetProjectTemplateStandardJobsGridDtoResult,
    IGetProjectTemplateStandardJobsGridQueryResult,
} from '../../../dal/drydock/ProjectTemplate/IGetProjectTemplateStandardJobsGridDto';

export class ProjectTemplatesService {
    notSelectedValueLabel = '-';

    public mapStandardJobsDataToDto(
        queryData: IGetProjectTemplateStandardJobsGridQueryResult,
    ): IGetProjectTemplateStandardJobsGridDtoResult {
        const resultData: IGetProjectTemplateStandardJobsGridDto[] = queryData.records.map((standardJob) => {
            let newItem: IGetProjectTemplateStandardJobsGridDto = {
                ProjectTemplateUid: standardJob.ProjectTemplateUid,
                StandardJobUid: standardJob.StandardJobUid,
                ItemNumber: standardJob.ItemNumber,
                DoneBy: standardJob.DoneBy || this.notSelectedValueLabel,
                DoneByUid: standardJob.DoneByUid,
                MaterialSuppliedBy: standardJob.MaterialSuppliedBy || this.notSelectedValueLabel,
                MaterialSuppliedByUid: standardJob.MaterialSuppliedByUid,
                Subject: standardJob.Subject,
                InspectionSurveyId: [],
                InspectionSurvey: standardJob.InspectionSurvey || this.notSelectedValueLabel,
                VesselTypeId: [],
                VesselType: 'All',
            };

            if (standardJob.InspectionSurveyId) {
                const inspectionIds = standardJob.InspectionSurveyId.split(',').map((id) => parseInt(id, 10));
                newItem = {
                    ...newItem,
                    InspectionSurveyId: _.uniq(inspectionIds),
                };
            }

            if (standardJob.VesselTypeId) {
                const vesselTypeIds = standardJob.VesselTypeId.split(',').map((id) => parseInt(id, 10));
                newItem = {
                    ...newItem,
                    VesselTypeId: _.uniq(vesselTypeIds),
                    VesselType: standardJob.VesselType,
                };
            }

            return newItem;
        });

        return {
            records: resultData,
            count: queryData.count,
        };
    }

    public mapTemplateDataToDto(queryData: IGetProjectTemplateGridQueryResult): IGetProjectTemplateGridDtoResult {
        const resultData: IGetProjectTemplateGridDto[] = queryData.records.map((template) => {
            let newItem: IGetProjectTemplateGridDto = {
                ProjectTemplateUid: template.ProjectTemplateUid,
                TemplateCode: template.TemplateCode,
                TemplateCodeRaw: template.TemplateCodeRaw,
                Subject: template.Subject,
                ProjectType: template.ProjectType,
                ProjectTypeUid: template.ProjectTypeUid,
                ProjectTypeCode: template.ProjectTypeCode,
                VesselTypeId: [],
                VesselType: 'All',
                VesselTypeSpecific: template.VesselTypeSpecific,
                NoOfSpecItems: template.NoOfSpecItems,
                LastUpdated: template.LastUpdated,
            };

            if (template.VesselTypeId) {
                const vesselTypeIds = template.VesselTypeId.split(',').map((id) => parseInt(id, 10));
                newItem = {
                    ...newItem,
                    VesselTypeId: _.uniq(vesselTypeIds),
                    VesselType: template.VesselType,
                };
            }

            return newItem;
        });

        return {
            records: resultData,
            count: queryData.count,
        };
    }
}
