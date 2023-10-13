import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionsTreeSelectComponent } from './functions-tree-select.component';

describe('FunctionsTreeSelectComponent', () => {
  let component: FunctionsTreeSelectComponent;
  let fixture: ComponentFixture<FunctionsTreeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionsTreeSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionsTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
