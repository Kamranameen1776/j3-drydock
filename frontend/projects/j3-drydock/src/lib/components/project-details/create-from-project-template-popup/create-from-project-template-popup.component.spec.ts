import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFromProjectTemplatePopupComponent } from './create-from-project-template-popup.component';

describe('CreateFromProjectTemplatePopupComponent', () => {
  let component: CreateFromProjectTemplatePopupComponent;
  let fixture: ComponentFixture<CreateFromProjectTemplatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFromProjectTemplatePopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFromProjectTemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
