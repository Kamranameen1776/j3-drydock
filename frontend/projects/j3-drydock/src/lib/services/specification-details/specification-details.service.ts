import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { Observable } from 'rxjs';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';

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
}
