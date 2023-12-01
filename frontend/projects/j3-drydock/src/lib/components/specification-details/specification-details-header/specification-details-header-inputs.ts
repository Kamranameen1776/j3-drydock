import { Injectable } from '@angular/core';
import f from 'odata-filter-builder';
import { ITopSectionFieldSet, UserRightsService, eAction, eApiBase, eCrud, eEntities, eUserStatus } from 'jibe-components';
import { Observable } from 'rxjs';
import { eSpecificationAccessActions } from '../../../models/enums/access-actions.enum';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';

export type SpecificationDetailsHeaderInputs = {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: Record<string, unknown>;
  canEdit: boolean;
};

@Injectable()
export class SpecificationDetailsHeaderInputservice {
  constructor(private specificationDetailsService: SpecificationDetailsService) {}

  topFieldsConfig: ITopSectionFieldSet = {
    showStatus: true,
    showVessel: true,
    showJobCard: true,
    jobStatus: 'raise',
    statusClass: 'status-9',
    jobStatusDisplayName: 'Raised',
    typeIconClass: 'icons8-document-4',
    worklistType: 'drydock',
    worklistDisplayName: 'Specification',
    jobCardNo: '',
    vesselName: '',
    jobTitle: '',
    bottomFieldsConfig: [
      {
        id: 'assigneeUid',
        label: 'Assigned To',
        isRequired: false,
        isEditable: true,
        type: 'dropdown',
        getFieldName: 'First_Name',
        saveFieldName: 'uid',
        controlContent: {
          label: 'First_Name',
          value: 'uid',
          id: 'assigneeUid',
          isValidation: false,
          apiRequest: {
            apiBase: eApiBase.MasterAPI,
            entity: eEntities.Master,
            action: eAction.GetDataSource,
            crud: eCrud.Get,
            params: `dataSourceName=user`,
            odata: {
              filter: new f().eq(eUserStatus.ActiveStatus, true),
              orderby: 'UserID',
              select: 'First_Name,uid,Active_Status'
            }
          }
        }
      }
    ]
  };

  detailedData = {
    assigneeUid: ''
  };

  canEdit = true;

  public getInputs(): Observable<SpecificationDetailsHeaderInputs> {
    return new Observable((sub) => {
      sub.next({
        topFieldsConfig: this.topFieldsConfig,
        detailedData: this.detailedData,
        canEdit: this.specificationDetailsService.hasAccess(eSpecificationAccessActions.editHeaderSection)
      });

      sub.complete();
    });
  }
}
