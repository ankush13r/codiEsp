import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxTrgComponent } from './text-box-trg.component';

describe('TextBoxTrgComponent', () => {
  let component: TextBoxTrgComponent;
  let fixture: ComponentFixture<TextBoxTrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBoxTrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxTrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
