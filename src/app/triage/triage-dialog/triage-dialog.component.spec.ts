import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageDialogComponent } from './triage-dialog.component';

describe('TriageDialogComponent', () => {
  let component: TriageDialogComponent;
  let fixture: ComponentFixture<TriageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
