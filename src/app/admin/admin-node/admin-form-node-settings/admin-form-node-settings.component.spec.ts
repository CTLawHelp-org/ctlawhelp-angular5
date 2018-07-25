import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormNodeSettingsComponent } from './admin-form-node-settings.component';

describe('AdminFormNodeSettingsComponent', () => {
  let component: AdminFormNodeSettingsComponent;
  let fixture: ComponentFixture<AdminFormNodeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormNodeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormNodeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
