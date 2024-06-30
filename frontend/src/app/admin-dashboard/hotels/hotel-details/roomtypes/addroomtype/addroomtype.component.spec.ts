import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddroomtypeComponent } from './addroomtype.component';

describe('AddroomtypeComponent', () => {
  let component: AddroomtypeComponent;
  let fixture: ComponentFixture<AddroomtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddroomtypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddroomtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
