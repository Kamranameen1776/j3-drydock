/* eslint-disable dot-notation */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { StandardJobsMainComponent } from './standard-jobs-main.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StandardJobsService } from '../../services/standard-jobs.service';
import { Title } from '@angular/platform-browser';
import { FunctionsService } from '../../services/functions.service';
import { of } from 'rxjs';
import { StandardJobUpsertFormService } from './upsert-standard-job-form/standard-job-upsert-form.service';
import { FunctionsFlatTreeNode } from '../../models/interfaces/functions-tree-node';
import { StandardJobResult } from '../../models/interfaces/standard-jobs';
import { asyncResponse } from '../../utils/tests.helper';

describe('StandardJobsComponent', () => {
  let component: StandardJobsMainComponent;
  let fixture: ComponentFixture<StandardJobsMainComponent>;
  let functionsService: FunctionsService;
  let standardJobsService: StandardJobsService;
  let getFunctionsSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [StandardJobsMainComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardJobsMainComponent);
    component = fixture.componentInstance;

    standardJobsService = fixture.debugElement.injector.get(StandardJobsService);
    spyOn(standardJobsService, 'hasAccess').and.returnValue(true);

    functionsService = fixture.debugElement.injector.get(FunctionsService);
    getFunctionsSpy = spyOn(functionsService, 'getFunctions').and.returnValue(of([]));
    // ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set all access rights in ngOnInit', () => {
    expect(component.canView).toBe(true, 'expected canView to be true');
    expect(component['canCreateJob']).toBe(true, 'expected canCreateJob to be true');
    expect(component['canEditJob']).toBe(true, 'expected canEditJob to be true');
    expect(component['canDeleteJob']).toBe(true, 'expected canDeleteJob to be true');
  });

  it('should gridInputs be defined in ngOnInit and show button same like canCreateJob', () => {
    expect(component.gridInputs).toBeDefined();
    expect(component.gridInputs.gridButton.show).toBe(component['canCreateJob'], 'expected gridButton.show to be equal canCreateJob');
  });

  it('Page title should be "Standard Jobs" in ngOnInit', () => {
    expect(TestBed.inject(Title).getTitle()).toBe('Standard Jobs');
  });

  it('should have called functionsService.getFunctions once in ngOnInit', () => {
    expect(getFunctionsSpy.calls.count()).toBe(1, 'getFunctions called once');
  });

  it('should load functions and set them in upsertFormService in ngOnInit', (done: DoneFn) => {
    getFunctionsSpy.calls.mostRecent().returnValue.subscribe((mappedFunctions: FunctionsFlatTreeNode[]) => {
      fixture.detectChanges();
      const upsertFormService = TestBed.inject(StandardJobUpsertFormService);
      expect(upsertFormService.functionsFlatTree$.getValue()).toEqual(mappedFunctions);
      done();
    });
  });

  it('should delete standard job and refresh grid', fakeAsync(() => {
    const deleteStandardJobSpy = spyOn(standardJobsService, 'deleteStandardJob').and.returnValue(asyncResponse(null));
    component['currentRow'] = { uid: '1' } as StandardJobResult;
    component.onConfirmDeleteOk();
    tick(0);
    expect(deleteStandardJobSpy.calls.count()).toBe(1, 'deleteStandardJob called once');
    expect(component['isConfirmDeleteVisible']).toBe(false, 'expected isConfirmDeleteVisible to be false');
    expect(component['currentRow']).toBeUndefined('expected currentRow to be undefined');
  }));
});
