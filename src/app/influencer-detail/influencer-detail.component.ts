import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfluencerService } from '../../services/influencer.service';
import { Influencer } from '../models/types';

@Component({
  selector: 'app-influencer-detail',
  templateUrl: './influencer-detail.component.html',
  styleUrls: ['./influencer-detail.component.scss']
})
export class InfluencerDetailComponent implements OnInit {
  influencer: Influencer | null = null;

  constructor(private route: ActivatedRoute, private influencerService: InfluencerService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.influencerService.getInfluencerById(id).subscribe(data => {
        this.influencer = data;
      });
    }
  }
}
