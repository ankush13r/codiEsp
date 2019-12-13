import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataControllerComponent } from './data-controller.component';

describe('DataControllerComponent', () => {
  let component: DataControllerComponent;
  let fixture: ComponentFixture<DataControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
