import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryProgressComponent } from './dictionary-progress.component';

describe('DictionaryProgressComponent', () => {
  let component: DictionaryProgressComponent;
  let fixture: ComponentFixture<DictionaryProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictionaryProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
