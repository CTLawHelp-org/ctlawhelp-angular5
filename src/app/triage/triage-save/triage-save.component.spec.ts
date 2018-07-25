import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageSaveComponent } from './triage-save.component';

describe('TriageSaveComponent', () => {
  let component: TriageSaveComponent;
  let fixture: ComponentFixture<TriageSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
