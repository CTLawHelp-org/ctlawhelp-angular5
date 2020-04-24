import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNsmiComponent } from './admin-nsmi.component';

describe('AdminNsmiComponent', () => {
  let component: AdminNsmiComponent;
  let fixture: ComponentFixture<AdminNsmiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNsmiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNsmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
