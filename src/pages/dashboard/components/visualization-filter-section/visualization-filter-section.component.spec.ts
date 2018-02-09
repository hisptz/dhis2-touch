import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationFilterSectionComponent } from './visualization-filter-section.component';

describe('VisualizationFilterSectionComponent', () => {
  let component: VisualizationFilterSectionComponent;
  let fixture: ComponentFixture<VisualizationFilterSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationFilterSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
