import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearhotelscountryComponent } from './nearhotelscountry.component';

describe('NearhotelscountryComponent', () => {
  let component: NearhotelscountryComponent;
  let fixture: ComponentFixture<NearhotelscountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearhotelscountryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearhotelscountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
