import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHelpMenuComponent } from './self-help-menu.component';

describe('SelfHelpMenuComponent', () => {
  let component: SelfHelpMenuComponent;
  let fixture: ComponentFixture<SelfHelpMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfHelpMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfHelpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
