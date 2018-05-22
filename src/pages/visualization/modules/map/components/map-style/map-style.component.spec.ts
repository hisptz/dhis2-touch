import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStyleComponent } from './map-style.component';

describe('MapStyleComponent', () => {
  let component: MapStyleComponent;
  let fixture: ComponentFixture<MapStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
