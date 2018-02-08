import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterpretationComponent } from './add-interpretation.component';

describe('AddInterpretationComponent', () => {
  let component: AddInterpretationComponent;
  let fixture: ComponentFixture<AddInterpretationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterpretationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterpretationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
