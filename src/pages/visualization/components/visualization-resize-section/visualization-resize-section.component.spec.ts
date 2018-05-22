import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationResizeSectionComponent } from './visualization-resize-section.component';

describe('VisualizationResizeSectionComponent', () => {
  let component: VisualizationResizeSectionComponent;
  let fixture: ComponentFixture<VisualizationResizeSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationResizeSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationResizeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
