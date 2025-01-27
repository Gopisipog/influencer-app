import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, InfluencerRanking, InfluencerCategory } from '../models/types';
import { ReplacePipe } from '../pipes/replace.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReplacePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  rankings: InfluencerRanking[] = [];
  loading = true;
  error: string | null = null;
  showApiKeyModal = false;
  apiKey = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    const savedApiKey = localStorage.getItem('perplexity_api_key');
    if (!savedApiKey) {
      this.showApiKeyModal = true;
    } else {
      this.loadDashboardData();
    }
  }

  async loadDashboardData() {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.dashboardService.getDashboardData();
      this.stats = data.stats;
      this.rankings = data.rankings;
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      if (error.message === 'API_KEY_REQUIRED') {
        this.showApiKeyModal = true;
        this.error = 'Please enter your Perplexity API key to continue';
      } else {
        this.error = 'Failed to load dashboard data';
      }
    } finally {
      this.loading = false;
    }
  }

  saveApiKey() {
    if (this.apiKey.trim()) {
      this.dashboardService.setApiKey(this.apiKey.trim());
      this.showApiKeyModal = false;
      this.apiKey = '';
      this.loadDashboardData();
    }
  }

  getTrendIcon(trend: 'up' | 'down'): string {
    return trend === 'up' ? '📈' : '📉';
  }
}
