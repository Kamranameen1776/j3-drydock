import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { Observable } from 'rxjs';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';

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
}
