import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectDetails } from '../../models/interfaces/project-details';

@Injectable()
export class CurrentProjectService {
  projectId$ = new BehaviorSubject(null);
  savedProject$ = new BehaviorSubject<ProjectDetails>(null);
}
