import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageSearchBarComponent } from './triage-search-bar.component';

describe('TriageSearchBarComponent', () => {
  let component: TriageSearchBarComponent;
  let fixture: ComponentFixture<TriageSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
