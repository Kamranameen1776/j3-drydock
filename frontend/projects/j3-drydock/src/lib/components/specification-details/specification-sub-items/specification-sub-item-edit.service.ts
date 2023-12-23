import { Injectable } from '@angular/core';

import { ApiRequestService, eCrud, eFieldControlType, FormModel, FormValues, WebApiRequest } from 'jibe-components';
import { specificationSubItemEditFormId } from '../../../models/constants/constants';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import {
  eSpecificationDetailsSubItemsFields,
  eSpecificationDetailsSubItemsLabels
} from '../../../models/enums/specification-details-sub-items.enum';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { Observable } from 'rxjs';
import { SectionModel } from 'jibe-components/lib/interfaces/section.model';

@Injectable({
  providedIn: 'root'
})
export class SpecificationSubItemEditService extends FormServiceBase {
  readonly formId = specificationSubItemEditFormId;

  protected readonly _formStructure: FormModel = {
    id: this.formId,
    label: '',
    type: 'form',
    sections: {
      [this.formId]: {
        type: 'grid',
        label: '',
        formID: this.formId,
        gridRowStart: 1,
        gridRowEnd: 6,
        gridColStart: 1,
        gridColEnd: 9,
        fields: {
          [`${eSpecificationDetailsSubItemsFields.Subject}`]: {
            label: eSpecificationDetailsSubItemsLabels.Subject,
            type: eFieldControlType.Text,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          },
          [eSpecificationDetailsSubItemsFields.UnitUid]: {
            label: eSpecificationDetailsSubItemsLabels.Unit,
            type: eFieldControlType.Dropdown,
            sectionID: this.formId,
            validatorRequired: false,
            enabled: true,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 2,
            gridColEnd: 3,
            listRequest: {
              webApiRequest: this.specificationDetailsService.getLibraryDataRequest('unitType'),
              labelKey: 'types',
              valueKey: 'uid'
            }
          },
          [`${eSpecificationDetailsSubItemsFields.Quantity}`]: {
            label: eSpecificationDetailsSubItemsLabels.Quantity,
            type: eFieldControlType.Number,
            sectionID: this.formId,
            enabled: false,
            validatorRequired: false,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 2
          },
          [`${eSpecificationDetailsSubItemsFields.UnitPrice}`]: {
            label: eSpecificationDetailsSubItemsLabels.UnitPrice,
            type: eFieldControlType.Number,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 2,
            gridColEnd: 3
          },
          [`${eSpecificationDetailsSubItemsFields.Discount}`]: {
            label: eSpecificationDetailsSubItemsLabels.Discount,
            type: eFieldControlType.Number,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColStart: 1,
            gridColEnd: 2,
            validatorMax: 100,
            validatorMin: 0,
            format: { afterDecimal: 2 }
          },
          [`${eSpecificationDetailsSubItemsFields.Description}`]: {
            label: eSpecificationDetailsSubItemsLabels.Description,
            type: eFieldControlType.TextAreaType,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 4,
            gridRowEnd: 5,
            gridColStart: 1,
            gridColEnd: 3,
            maxTextLength: 1000
          }
        }
      } as SectionModel
    }
  };

  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        [eSpecificationDetailsSubItemsFields.Subject]: null,
        [eSpecificationDetailsSubItemsFields.Unit]: null,
        [eSpecificationDetailsSubItemsFields.Quantity]: null,
        [eSpecificationDetailsSubItemsFields.UnitPrice]: null,
        [eSpecificationDetailsSubItemsFields.Discount]: null,
        [eSpecificationDetailsSubItemsFields.Description]: null
      }
    }
  };

  constructor(
    private specificationDetailsService: SpecificationDetailsService,
    private apiRequestService: ApiRequestService
  ) {
    super();
  }

  getFormValues(data?: SpecificationSubItem): FormValues {
    return {
      ...this.formValues,
      values: {
        [this.formId]: {
          [eSpecificationDetailsSubItemsFields.Subject]: data?.subject,
          [eSpecificationDetailsSubItemsFields.UnitUid]: data?.unitTypeUid,
          [eSpecificationDetailsSubItemsFields.Quantity]: data?.quantity,
          [eSpecificationDetailsSubItemsFields.UnitPrice]: data?.unitPrice,
          [eSpecificationDetailsSubItemsFields.Discount]: data?.discount,
          [eSpecificationDetailsSubItemsFields.Description]: data?.description
        }
      }
    };
  }

  public updateSubItem(data: SpecificationSubItem, uid: string, specificationUid: string): Observable<SpecificationSubItem> {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/sub-items/update-sub-item',
      crud: eCrud.Put,
      body: {
        uid,
        specificationDetailsUid: specificationUid,
        props: {
          subject: data[eSpecificationDetailsSubItemsFields.Subject],
          unitUid: data[eSpecificationDetailsSubItemsFields.UnitUid],
          quantity: data[eSpecificationDetailsSubItemsFields.Quantity],
          unitPrice: data[eSpecificationDetailsSubItemsFields.UnitPrice],
          discount: data[eSpecificationDetailsSubItemsFields.Discount],
          description: data[eSpecificationDetailsSubItemsFields.Description]
        }
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

    public createSubItem(data: SpecificationSubItem, specificationUid: string): Observable<SpecificationSubItem> {
        const request: WebApiRequest = {
            apiBase: 'dryDockAPI',
            entity: 'drydock',
            action: 'specification-details/sub-items/create-sub-item',
            crud: eCrud.Post,
            body: {
                specificationDetailsUid: specificationUid,
                props: {
                    subject: data[eSpecificationDetailsSubItemsFields.Subject],
                    unitUid: data[eSpecificationDetailsSubItemsFields.UnitUid],
                    quantity: data[eSpecificationDetailsSubItemsFields.Quantity],
                    unitPrice: data[eSpecificationDetailsSubItemsFields.UnitPrice],
                    discount: data[eSpecificationDetailsSubItemsFields.Discount],
                    description: data[eSpecificationDetailsSubItemsFields.Description]
                }
            }
        };

        return this.apiRequestService.sendApiReq(request);
    }

  public deleteSubItem(uid: string, specificationUid: string): Observable<SpecificationSubItem> {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/sub-items/delete-sub-item',
      crud: eCrud.Put,
      body: {
        uid,
        specificationDetailsUid: specificationUid
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }
}
