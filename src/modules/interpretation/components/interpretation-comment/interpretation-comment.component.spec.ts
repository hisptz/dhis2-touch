import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretationCommentComponent } from './interpretation-comment.component';

describe('InterpretationCommentComponent', () => {
  let component: InterpretationCommentComponent;
  let fixture: ComponentFixture<InterpretationCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterpretationCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretationCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
