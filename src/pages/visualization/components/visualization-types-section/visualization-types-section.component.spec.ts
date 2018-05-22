import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationTypesSectionComponent } from './visualization-types-section.component';

describe('VisualizationTypesSectionComponent', () => {
  let component: VisualizationTypesSectionComponent;
  let fixture: ComponentFixture<VisualizationTypesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationTypesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationTypesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
