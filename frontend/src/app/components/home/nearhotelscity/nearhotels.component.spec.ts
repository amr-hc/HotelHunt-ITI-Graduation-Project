import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearhotelsComponent } from './nearhotels.component';

describe('NearhotelsComponent', () => {
  let component: NearhotelsComponent;
  let fixture: ComponentFixture<NearhotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearhotelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearhotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
