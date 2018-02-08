import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesContainerComponent } from './resources-container.component';

describe('ResourcesContainerComponent', () => {
  let component: ResourcesContainerComponent;
  let fixture: ComponentFixture<ResourcesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
