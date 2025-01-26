import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchConfigComponent } from './research-config.component';

describe('ResearchConfigComponent', () => {
  let component: ResearchConfigComponent;
  let fixture: ComponentFixture<ResearchConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
