import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHelpComponent } from './self-help.component';

describe('SelfHelpComponent', () => {
  let component: SelfHelpComponent;
  let fixture: ComponentFixture<SelfHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
