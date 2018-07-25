import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHelpLandingLgComponent } from './self-help-landing-lg.component';

describe('SelfHelpLandingLgComponent', () => {
  let component: SelfHelpLandingLgComponent;
  let fixture: ComponentFixture<SelfHelpLandingLgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfHelpLandingLgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfHelpLandingLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
