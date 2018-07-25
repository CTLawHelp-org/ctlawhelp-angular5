import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTopComponent } from './node-top.component';

describe('NodeTopComponent', () => {
  let component: NodeTopComponent;
  let fixture: ComponentFixture<NodeTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
