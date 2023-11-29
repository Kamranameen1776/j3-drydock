import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentProjectService {
  projectId$ = new BehaviorSubject<string>(null);
  vesselUid$ = new BehaviorSubject<string>(null);
}
