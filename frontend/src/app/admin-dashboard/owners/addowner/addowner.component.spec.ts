import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddownerComponent } from './addowner.component';

describe('AddownerComponent', () => {
  let component: AddownerComponent;
  let fixture: ComponentFixture<AddownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddownerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
