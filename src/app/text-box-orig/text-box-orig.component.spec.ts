import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxOrigComponent } from './text-box-orig.component';

describe('TextBoxOrigComponent', () => {
  let component: TextBoxOrigComponent;
  let fixture: ComponentFixture<TextBoxOrigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBoxOrigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxOrigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
