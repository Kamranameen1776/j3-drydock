import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationComponent } from './specification.component';
import { SpecificationGridService } from '../../services/specifications/specification.service';
import { SpecificationTopDetailsService } from '../../services/specifications/specification-top-details.service';

describe('SpecificationPageComponent', () => {
  let component: SpecificationComponent;
  let fixture: ComponentFixture<SpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationComponent],
      providers: [SpecificationGridService, SpecificationTopDetailsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
