import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHelpLandingComponent } from './self-help-landing.component';

describe('SelfHelpLandingComponent', () => {
  let component: SelfHelpLandingComponent;
  let fixture: ComponentFixture<SelfHelpLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfHelpLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfHelpLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
