import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { map } from 'rxjs/operators';
import { FunctionsFlatTreeNode, ShellFunctionTreeResponseNode } from '../../models/interfaces/functions-tree-node';
import { eSpecificationDetailsGeneralInformationFields } from '../../models/enums/specification-details-general-information.enum';
import f from 'odata-filter-builder';
@Injectable({
  providedIn: 'root'
})
export class SpecificationDetailsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getSpecificationDetails(specificationUid: string): Observable<GetSpecificationDetailsDto> {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/get-specification-details',
      crud: eCrud.Get,
      params: `uid=${specificationUid}`
    };

    return this.apiRequestService.sendApiReq(request);
  }

  /**
   * @description: Used to update Specification details on a Specificaion Single Page
   **/
  updateSpecification(data: UpdateSpecificationDetailsDto): Observable<string> {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/update-specification-details',
      crud: eCrud.Put,
      body: data
    };
    return this.apiRequestService.sendApiReq(request);
  }

  public getPriorityRequest() {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Library,
      action: 'get-library-data-by-code',
      params: `libraryCode=Urgencys`,
      crud: eCrud.Post,
      odata: {
        count: 'false',
        filter: f().eq('active_status', true)
      }
    };
    return apiRequest;
  }

  public getStandardJobsFiltersRequest(fieldName: eSpecificationDetailsGeneralInformationFields) {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs-filters',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        key: fieldName
      }
    };
    return apiRequest;
  }
}
