import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationCardLoaderComponent } from './visualization-card-loader.component';

describe('VisualizationCardLoaderComponent', () => {
  let component: VisualizationCardLoaderComponent;
  let fixture: ComponentFixture<VisualizationCardLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationCardLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationCardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
