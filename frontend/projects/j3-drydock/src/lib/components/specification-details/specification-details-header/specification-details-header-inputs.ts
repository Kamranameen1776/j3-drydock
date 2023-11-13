import { Injectable } from '@angular/core';
import f from 'odata-filter-builder';
import { ISingleSelectDropdown, eAction, eApiBase, eCrud, eEntities, eUserStatus } from 'jibe-components';
import { HeaderButton, HeaderSection } from '../../../shared/components/generic-header/generic-header.interfaces';

export type SpecificationDetailsHeaderInputs = {
  assigneeDropdown: ISingleSelectDropdown;
  headerButtons: HeaderButton[];
  headerSections: HeaderSection[];
  //TODO: tooltip will according to workflow type
  //buttonTooltip: Partial<Record<WorkerType, string>>
  buttonTooltip: Partial<Record<string, string>>;
};

@Injectable()
export class SpecificationDetailsHeaderInputservice {
  constructor() {}

  private assigneeDropdown: ISingleSelectDropdown = {
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
  };

  private headerButtons: HeaderButton[] = [
    {
      id: 'save',
      buttonType: 'Standard',
      command: null,
      label: 'Save',
      buttonClass: 'save'
    }
  ];

  private buttonTooltip: Partial<Record<string, string>> = {
    REVIEW: 'There are no financial items/quotation items selected or some financial item has empty glAccountUid'
  };

  private headerSections: HeaderSection[] = [
    {
      label: '',
      labelClass: '',
      labelColor: 'var(--jbGreyBlue500)',
      iconClass: 'icons8-water-transportation',
      iconColor: 'var(--jbBrandBlue500)'
    },
    {
      label: '',
      labelClass: '',
      labelColor: 'var(--jbBrandBlue500)',
      iconClass: 'icons8-document-4',
      iconColor: ''
    }
  ];

  public getPopupInputs(): SpecificationDetailsHeaderInputs {
    return {
      assigneeDropdown: this.assigneeDropdown,
      headerButtons: this.headerButtons,
      headerSections: this.headerSections,
      buttonTooltip: this.buttonTooltip
    };
  }
}
