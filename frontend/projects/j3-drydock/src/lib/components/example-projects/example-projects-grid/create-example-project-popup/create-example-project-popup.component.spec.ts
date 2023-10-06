import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExampleProjectPopupComponent } from './create-example-project-popup.component';

describe('CreateExampleProjectPopupComponent', () => {
  let component: CreateExampleProjectPopupComponent;
  let fixture: ComponentFixture<CreateExampleProjectPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExampleProjectPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExampleProjectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
