import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomtypesComponent } from './roomtypes.component';

describe('RoomtypesComponent', () => {
  let component: RoomtypesComponent;
  let fixture: ComponentFixture<RoomtypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomtypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
