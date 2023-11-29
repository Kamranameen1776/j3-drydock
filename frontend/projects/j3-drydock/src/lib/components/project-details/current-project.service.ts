import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskManagerService } from '../../services/task-manager.service';

@Injectable()
export class CurrentProjectService {
  projectId$ = new BehaviorSubject<string>(null);
  vesselUid$ = new BehaviorSubject<string>(null);

  constructor(private taskManagerService: TaskManagerService) {}
}
