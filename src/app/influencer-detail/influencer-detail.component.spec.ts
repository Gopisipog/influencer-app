import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerDetailComponent } from './influencer-detail.component';

describe('InfluencerDetailComponent', () => {
  let component: InfluencerDetailComponent;
  let fixture: ComponentFixture<InfluencerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluencerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
