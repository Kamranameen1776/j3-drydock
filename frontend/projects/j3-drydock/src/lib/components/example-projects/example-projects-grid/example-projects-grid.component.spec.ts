import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleProjectsGridComponent } from './example-projects-grid.component';

describe('ExampleProjectsGridComponent', () => {
  let component: ExampleProjectsGridComponent;
  let fixture: ComponentFixture<ExampleProjectsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleProjectsGridComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleProjectsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
