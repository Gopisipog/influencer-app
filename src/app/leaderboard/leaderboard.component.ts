import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Influencer } from '../models/types';
import { InfluencerService } from '../../services/influencer.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  influencers: Influencer[] = [];
  
  constructor(private influencerService: InfluencerService) {}

  ngOnInit() {
    this.influencerService.getInfluencers()
      .subscribe({
        next: (data: Influencer[]) => {
          this.influencers = data;
          this.sortByTrustScore(); // Initially sort by trust score
        },
        error: (error: any) => {
          console.error('Error fetching influencers:', error);
          // TODO: Implement error handling UI
        }
      });
  }

  sortByTrustScore() {
    this.influencers.sort((a, b) => b.trustScore - a.trustScore);
  }

  sortByFollowers() {
    this.influencers.sort((a, b) => b.followerCount - a.followerCount);
  }
}
