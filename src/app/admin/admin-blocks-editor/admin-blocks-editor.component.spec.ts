import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlocksEditorDialogComponent } from './admin-blocks-editor.component';

describe('AdminBlocksEditorDialogComponent', () => {
  let component: AdminBlocksEditorDialogComponent;
  let fixture: ComponentFixture<AdminBlocksEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBlocksEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBlocksEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
