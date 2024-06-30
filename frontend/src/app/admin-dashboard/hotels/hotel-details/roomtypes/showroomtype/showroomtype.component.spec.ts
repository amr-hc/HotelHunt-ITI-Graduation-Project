import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomtypeComponent } from './showroomtype.component';

describe('ShowroomtypeComponent', () => {
  let component: ShowroomtypeComponent;
  let fixture: ComponentFixture<ShowroomtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowroomtypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowroomtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
