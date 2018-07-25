import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempTopComponent } from './temp-top.component';

describe('TempTopComponent', () => {
  let component: TempTopComponent;
  let fixture: ComponentFixture<TempTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
