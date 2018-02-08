import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretationLikeComponent } from './interpretation-like.component';

describe('InterpretationLikeComponent', () => {
  let component: InterpretationLikeComponent;
  let fixture: ComponentFixture<InterpretationLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterpretationLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretationLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
