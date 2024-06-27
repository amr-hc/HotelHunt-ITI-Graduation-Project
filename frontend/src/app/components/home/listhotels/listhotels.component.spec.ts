import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListhotelsComponent } from './listhotels.component';

describe('ListhotelsComponent', () => {
  let component: ListhotelsComponent;
  let fixture: ComponentFixture<ListhotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListhotelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListhotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
