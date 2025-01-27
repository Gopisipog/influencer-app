import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerplexityService } from '../../services/perplexity.service';
import { PerplexityResponse, ResearchReport, ResearchClaim, VerificationStatus } from '../models/types';

interface TrustScoreFactors {
  claimsScore: number;
  credentialsScore: number;
  sourceQualityScore: number;
  consistencyScore: number;
}

@Component({
  selector: 'app-research-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './research-config.component.html',
  styleUrls: ['./research-config.component.scss']
})
export class ResearchConfigComponent {
  influencerName: string = '';
  timeRange: string = 'last_3_months';
  claimsToAnalyze: number = 50;
  productsToFind: number = 10;
  notesForResearchAssistant: string = '';
  includeRevenueAnalysis: boolean = false;
  verifyWithScientificJournals: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  researchReport: ResearchReport | null = null;
  selectedCategory: string = '';
  selectedStatus: string = '';
  sortBy: string = 'date';
  activeFilters: string[] = [];
  filteredClaims: ResearchClaim[] = [];

  constructor(private perplexityService: PerplexityService) {}

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTimeRangeDisplay(): string {
    const ranges: { [key: string]: string } = {
      'last_month': 'Last Month',
      'last_3_months': 'Last 3 Months',
      'last_6_months': 'Last 6 Months',
      'last_year': 'Last Year'
    };
    return ranges[this.timeRange] || this.timeRange;
  }

  getClaimStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('support')) return 'supported';
    if (statusLower.includes('debunk')) return 'debunked';
    return 'questionable';
  }

  sendPrompt() {
    if (!this.influencerName) {
      this.error = 'Please enter an influencer name';
      return;
    }

    this.loading = true;
    this.error = null;
    this.researchReport = null;
    
    const prompt = this.buildResearchPrompt();
    this.perplexityService.getResponse(prompt).subscribe({
      next: (response: PerplexityResponse) => {
        try {
          const content = response.choices[0]?.message?.content;
          if (!content) {
            throw new Error('No content in response');
          }
          this.researchReport = this.processResearchReport(content);
          this.filteredClaims = this.researchReport.claims;
          this.sortClaims();
        } catch (e) {
          console.error('Error parsing response:', e);
          this.error = 'Failed to parse research results';
        } finally {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('API error:', error);
        this.error = 'Failed to generate research report';
        this.loading = false;
      }
    });
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

  private buildResearchPrompt(): string {
    return `
      Return ONLY a JSON response without any additional text or explanation.
      Analyze health influencer ${this.influencerName} and provide a research report in this exact JSON format:
      
      {
        "influencerInfo": {
          "bio": "Brief professional biography",
          "expertise": ["List of areas of expertise"],
          "followers": "Total follower count across platforms",
          "credentials": ["List of relevant credentials"]
        },
        "trustScore": 0,
        "claims": [
          {
            "id": "unique-claim-id",
            "claim": "Specific health claim made by influencer",
            "status": "Supported by scientific research/Questionable/Debunked",
            "category": "Category of the claim",
            "source": "Scientific journal or reliable source name",
            "link": "URL to source",
            "evidence": "Brief summary of supporting or contradicting evidence",
            "date": "YYYY-MM-DD",
            "confidenceScore": 0
          }
        ],
        "products": [
          {
            "name": "Product name",
            "type": "Product type/category",
            "price": "Price in USD",
            "claims": ["List of claims made about product"],
            "verificationStatus": "Verified/Unverified/Misleading"
          }
        ]${this.includeRevenueAnalysis ? `,
        "revenueAnalysis": {
          "estimatedRevenue": "Annual revenue estimate",
          "primarySources": ["List of main revenue sources"],
          "partnerships": ["List of known partnerships"]
        }` : ''}
      }

      Parameters:
      Time Range: ${this.timeRange}
      Claims to Analyze: ${this.claimsToAnalyze}
      Products to Find: ${this.productsToFind}
      Additional Notes: ${this.notesForResearchAssistant}
      ${this.verifyWithScientificJournals ? 'Verify claims with peer-reviewed scientific journals.' : ''}
    `.trim();
  }

  getExpertiseCategories(): string[] {
    return this.researchReport?.influencerInfo?.expertise || [];
  }

  getClaimCategories(): string[] {
    const categories = new Set<string>();
    this.researchReport?.claims.forEach(claim => {
      categories.add(claim.category);
    });
    return Array.from(categories);
  }

  filterClaims() {
    this.activeFilters = [];
    if (this.selectedCategory) {
      this.activeFilters.push(`Category: ${this.selectedCategory}`);
    }
    if (this.selectedStatus) {
      this.activeFilters.push(`Status: ${this.selectedStatus}`);
    }

    this.filteredClaims = this.researchReport?.claims.filter(claim => {
      const categoryMatch = !this.selectedCategory || claim.category === this.selectedCategory;
      const statusMatch = !this.selectedStatus || claim.status === this.selectedStatus;
      return categoryMatch && statusMatch;
    }) || [];

    this.sortClaims();
  }

  sortClaims() {
    this.filteredClaims.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  removeFilter(filter: string) {
    const filterType = filter.split(':')[0].trim();
    if (filterType === 'Category') {
      this.selectedCategory = '';
    } else if (filterType === 'Status') {
      this.selectedStatus = '';
    }
    this.filterClaims();
  }

  processResearchReport(content: string): ResearchReport {
    try {
      const jsonStr = this.extractJsonFromText(content);
      if (!jsonStr) {
        throw new Error('No JSON data found in response');
      }

      const rawData = JSON.parse(jsonStr);
      
      // Ensure all required fields are present and properly formatted
      const report: ResearchReport = {
        influencerInfo: {
          bio: rawData.influencerInfo?.bio || 'No biography available',
          expertise: Array.isArray(rawData.influencerInfo?.expertise) 
            ? rawData.influencerInfo.expertise 
            : [],
          followers: rawData.influencerInfo?.followers || '0',
          credentials: Array.isArray(rawData.influencerInfo?.credentials) 
            ? rawData.influencerInfo.credentials 
            : []
        },
        claims: (rawData.claims || []).map((claim: any) => ({
          id: claim.id || `claim-${Math.random().toString(36).substr(2, 9)}`,
          claim: claim.claim || '',
          status: this.validateVerificationStatus(claim.status),
          category: claim.category || 'Uncategorized',
          source: claim.source || 'Unknown source',
          link: this.validateUrl(claim.link),
          evidence: claim.evidence || 'No evidence provided',
          date: this.validateDate(claim.date)
        })),
        products: (rawData.products || []).map((product: any) => ({
          name: product.name || 'Unnamed product',
          type: product.type || 'Unknown type',
          price: product.price || 'N/A',
          claims: Array.isArray(product.claims) ? product.claims : [],
          verificationStatus: this.validateVerificationStatus(product.verificationStatus)
        }))
      };

      // Add revenue analysis if included
      if (this.includeRevenueAnalysis && rawData.revenueAnalysis) {
        report.revenueAnalysis = {
          estimatedRevenue: rawData.revenueAnalysis.estimatedRevenue || 'Unknown',
          primarySources: Array.isArray(rawData.revenueAnalysis.primarySources) 
            ? rawData.revenueAnalysis.primarySources 
            : [],
          partnerships: Array.isArray(rawData.revenueAnalysis.partnerships) 
            ? rawData.revenueAnalysis.partnerships 
            : []
        };
      }
      
      return report;
    } catch (e) {
      console.error('Error processing research report:', e);
      throw new Error('Failed to process research report');
    }
  }

  private validateVerificationStatus(status: string): VerificationStatus {
    const validStatuses = Object.values(VerificationStatus);
    const normalizedStatus = status?.trim()?.toLowerCase() || '';
    
    if (normalizedStatus.includes('support')) {
      return VerificationStatus.Verified;
    } else if (normalizedStatus.includes('debunk')) {
      return VerificationStatus.Debunked;
    }
    return VerificationStatus.Questionable;
  }

  private validateUrl(url: string): string {
    try {
      return new URL(url || '').toString();
    } catch {
      return '#';
    }
  }

  private validateDate(date: string): string {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return parsed.toISOString().split('T')[0];
  }
}
