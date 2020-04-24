import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLabelEditorDialogComponent } from './admin-label-editor.component';

describe('AdminLabelEditorDialogComponent', () => {
  let component: AdminLabelEditorDialogComponent;
  let fixture: ComponentFixture<AdminLabelEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLabelEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLabelEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
