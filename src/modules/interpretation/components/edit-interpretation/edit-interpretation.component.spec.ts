import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterpretationComponent } from './edit-interpretation.component';

describe('EditInterpretationComponent', () => {
  let component: EditInterpretationComponent;
  let fixture: ComponentFixture<EditInterpretationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInterpretationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInterpretationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
