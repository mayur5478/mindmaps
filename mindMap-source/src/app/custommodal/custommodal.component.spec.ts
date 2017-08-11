import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommodalComponent } from './custommodal.component';

describe('CustommodalComponent', () => {
  let component: CustommodalComponent;
  let fixture: ComponentFixture<CustommodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustommodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustommodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
