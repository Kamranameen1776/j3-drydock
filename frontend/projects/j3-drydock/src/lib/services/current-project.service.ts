import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentProjectService {
  projectId = new BehaviorSubject(null);
  vesselUid = new BehaviorSubject(null);
}
