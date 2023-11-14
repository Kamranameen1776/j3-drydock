import { Injectable } from '@angular/core';
import { ApiRequestService } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  constructor(private apiRequestService: ApiRequestService) {}
}
