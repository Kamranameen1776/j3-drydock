import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleProjectsComponent } from './example-projects.component';

describe('ExampleProjectsComponent', () => {
  let component: ExampleProjectsComponent;
  let fixture: ComponentFixture<ExampleProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
