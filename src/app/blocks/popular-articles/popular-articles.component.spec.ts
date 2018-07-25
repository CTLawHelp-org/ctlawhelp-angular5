import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularArticlesComponent } from './popular-articles.component';

describe('PopularArticlesComponent', () => {
  let component: PopularArticlesComponent;
  let fixture: ComponentFixture<PopularArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
