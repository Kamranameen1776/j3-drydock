import { Injectable } from '@angular/core';
import { ITopSectionFieldSet } from 'jibe-components';
import { Observable } from 'rxjs';
import { SpecificationDetails, SpecificationDetailsTopHeaderDetails } from '../../../models/interfaces/specification-details';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';

export type SpecificationDetailsHeaderInputs<T> = {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: T;
};
@Injectable()
export class SpecificationDetailsHeaderInputservice {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private specificatioDetailService: SpecificationDetailsService) {}

  getTopSecConfig(details: SpecificationDetails | SpecificationDetailsTopHeaderDetails): ITopSectionFieldSet {
    return {
      showStatus: true,
      showVessel: true,
      showJobCard: true,
      jobStatus: details.StatusId,
      statusClass: 'status-9',
      jobStatusDisplayName: details.StatusName,
      typeIconClass: 'icons8-document-4',
      worklistType: details.SpecificationTypeCode,
      worklistDisplayName: details.SpecificationTypeName,
      jobCardNo: details.SpecificationCode,
      vesselName: details.VesselName,
      jobTitle: details.Subject,
      bottomFieldsConfig: [
        {
          id: 'assigneeUid',
          label: 'Assigned To',
          isRequired: false,
          isEditable: false,
          type: 'dropdown',
          getFieldName: 'ProjectManagerUid',
          saveFieldName: 'ProjectManagerUid',
          controlContent: {
            id: 'assigneeUid',
            value: 'ManagerId',
            label: 'FullName',
            selectedValue: details.ProjectManagerUid,
            selectedLabel: details.ProjectManager,
            apiRequest: this.specificatioDetailService.getProjectsManagersRequest()
          }
        }
      ]
    };
  }

  public getInputs(specificationDetailsInfo: SpecificationDetails): Observable<SpecificationDetailsHeaderInputs<SpecificationDetails>> {
    return new Observable((sub) => {
      sub.next({
        topFieldsConfig: this.getTopSecConfig(specificationDetailsInfo),
        detailedData: specificationDetailsInfo
      });

      sub.complete();
    });
  }

  getStatusForWorkflowActionsJbComponent(status: string) {
    return `${status}_::_`;
  }

  getStatusFromWorkflowActionsJbComponent(status: string) {
    return status.replace('_::_', '');
  }
}
