import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilebrowserComponent } from './admin-filebrowser.component';

describe('AdminFilebrowserComponent', () => {
  let component: AdminFilebrowserComponent;
  let fixture: ComponentFixture<AdminFilebrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFilebrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFilebrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
