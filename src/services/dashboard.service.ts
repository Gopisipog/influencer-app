import { Injectable } from '@angular/core';
import { DashboardStats, InfluencerRanking, InfluencerCategory, PerplexityResponse } from '../app/models/types';
import { PerplexityService } from './perplexity.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private perplexityService: PerplexityService) {}

  async getDashboardData(): Promise<{stats: DashboardStats, rankings: InfluencerRanking[]}> {
    const prompt = `
      Return ONLY a JSON response without any additional text or explanation.
      Provide current dashboard data for top health and wellness influencers in this exact JSON format:
      {
        "stats": {
          "activeInfluencers": 1234,
          "claimsVerified": 25431,
          "averageTrustScore": 85.7
        },
        "rankings": [
          {
            "rank": 1,
            "name": "Dr. Peter Attia",
            "category": "Medicine",
            "trustScore": 94,
            "trend": "up",
            "followers": "1.2M",
            "verifiedClaims": 203
          }
        ]
      }

      Rules:
      1. Include exactly 10 most credible health influencers
      2. Use real, current data from 2024
      3. Focus on influencers with medical or scientific credentials
      4. All numeric values must be numbers, not strings
      5. Only followers field should be a string with K or M suffix
    `.trim();

    try {
      const response = await firstValueFrom(this.perplexityService.getResponse(prompt));
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      const jsonStr = this.extractJsonFromText(content);
      if (!jsonStr) {
        throw new Error('No JSON data found in response');
      }

      const rawData = JSON.parse(jsonStr);
      return this.normalizeData(rawData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return this.getDefaultData();
    }
  }

  private normalizeData(rawData: any): {stats: DashboardStats, rankings: InfluencerRanking[]} {
    return {
      stats: {
        activeInfluencers: Number(rawData.stats.activeInfluencers),
        claimsVerified: Number(rawData.stats.claimsVerified),
        averageTrustScore: Number(rawData.stats.averageTrustScore)
      },
      rankings: rawData.rankings.map((rank: any) => ({
        rank: Number(rank.rank),
        name: String(rank.name),
        category: rank.category as InfluencerCategory,
        trustScore: Number(rank.trustScore),
        trend: rank.trend as 'up' | 'down',
        followers: String(rank.followers),
        verifiedClaims: Number(rank.verifiedClaims)
      }))
    };
  }

  private getDefaultData(): {stats: DashboardStats, rankings: InfluencerRanking[]} {
    return {
      stats: {
        activeInfluencers: 0,
        claimsVerified: 0,
        averageTrustScore: 0
      },
      rankings: []
    };
  }

  private extractJsonFromText(text: string): string {
    try {
      const startIndex = text.indexOf('{');
      if (startIndex === -1) return '';

      let bracketCount = 0;
      let endIndex = startIndex;

      for (let i = startIndex; i < text.length; i++) {
        if (text[i] === '{') bracketCount++;
        if (text[i] === '}') bracketCount--;
        
        if (bracketCount === 0) {
          endIndex = i + 1;
          break;
        }
      }

      return text.substring(startIndex, endIndex);
    } catch (e) {
      console.error('Error extracting JSON:', e);
      return '';
    }
  }
}
