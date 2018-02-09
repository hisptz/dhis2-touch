import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressLoaderComponent } from './progress-loader.component';

describe('ProgressLoaderComponent', () => {
  let component: ProgressLoaderComponent;
  let fixture: ComponentFixture<ProgressLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
