import { Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { InfluencerDetailComponent } from './influencer-detail/influencer-detail.component';
import { ResearchConfigComponent } from './research-config/research-config.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'config', 
    component: ResearchConfigComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'leaderboard', 
    component: LeaderboardComponent 
  },
  { 
    path: 'influencer/:id', 
    component: InfluencerDetailComponent 
  }
];
