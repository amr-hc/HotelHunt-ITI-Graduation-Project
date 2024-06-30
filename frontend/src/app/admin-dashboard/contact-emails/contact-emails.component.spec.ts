import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEmailsComponent } from './contact-emails.component';

describe('ContactEmailsComponent', () => {
  let component: ContactEmailsComponent;
  let fixture: ComponentFixture<ContactEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactEmailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
