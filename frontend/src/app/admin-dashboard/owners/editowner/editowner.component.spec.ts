import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditownerComponent } from './editowner.component';

describe('EditownerComponent', () => {
  let component: EditownerComponent;
  let fixture: ComponentFixture<EditownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditownerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
