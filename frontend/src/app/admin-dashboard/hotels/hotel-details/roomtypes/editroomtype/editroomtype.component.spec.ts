import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditroomtypeComponent } from './editroomtype.component';

describe('EditroomtypeComponent', () => {
  let component: EditroomtypeComponent;
  let fixture: ComponentFixture<EditroomtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditroomtypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditroomtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
