import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCreditComponent } from './article-credit.component';

describe('ArticleCreditComponent', () => {
  let component: ArticleCreditComponent;
  let fixture: ComponentFixture<ArticleCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
