import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectDetails } from '../../models/interfaces/project-details';

@Injectable()
export class CurrentProjectService {
  initialProject$ = new BehaviorSubject<ProjectDetails>(null);
}
