import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageLoadComponent } from './triage-load.component';

describe('TriageLoadComponent', () => {
  let component: TriageLoadComponent;
  let fixture: ComponentFixture<TriageLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
