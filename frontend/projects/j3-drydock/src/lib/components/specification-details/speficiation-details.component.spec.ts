import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationDetailsComponent } from './specification-details.component';
import { SpecificationGridService } from '../../services/specifications/specification.service';
import { SpecificationTopDetailsService } from '../../services/specifications/specification-top-details.service';

describe('SpecificationDetailsComponent', () => {
  let component: SpecificationDetailsComponent;
  let fixture: ComponentFixture<SpecificationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationDetailsComponent],
      providers: [SpecificationGridService, SpecificationTopDetailsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
