import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, InfluencerRanking, InfluencerCategory } from '../models/types';
import { ReplacePipe } from '../pipes/replace.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReplacePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  rankings: InfluencerRanking[] = [];
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const data = await this.dashboardService.getDashboardData();
      this.stats = data.stats;
      this.rankings = data.rankings;
    } catch (error) {
      this.error = 'Failed to load dashboard data';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  getTrendIcon(trend: 'up' | 'down'): string {
    return trend === 'up' ? '📈' : '📉';
  }
}
