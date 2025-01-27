export interface DashboardStats {
  activeInfluencers: number;
  claimsVerified: number;
  averageTrustScore: number;
}

export interface InfluencerRanking {
  rank: number;
  name: string;
  category: InfluencerCategory;
  trustScore: number;
  trend: 'up' | 'down';
  followers: string;
  verifiedClaims: number;
}

export enum InfluencerCategory {
  Medicine = 'Medicine',
  Nutrition = 'Nutrition',
  Mental_Health = 'Mental_Health',
  Neuroscience = 'Neuroscience',
  Longevity = 'Longevity',
  Integrative_Medicine = 'Integrative_Medicine',
  Fitness = 'Fitness'
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  followerCount: number;
  trustScore: number;
  claimStats: ClaimStats;
}

export interface Claim {
  id: string;
  influencerId: string;
  content: string;
  category: ClaimCategory;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  source: string;
  dateFound: Date;
  scientificReferences?: string[];
}

export interface ClaimStats {
  verified: number;
  questionable: number;
  debunked: number;
}

export enum ClaimCategory {
  Nutrition = 'Nutrition',
  Medicine = 'Medicine',
  MentalHealth = 'Mental Health',
  Fitness = 'Fitness',
  Other = 'Other'
}

export enum VerificationStatus {
  Verified = 'Verified',
  Questionable = 'Questionable',
  Debunked = 'Debunked'
}

export interface ResearchConfig {
  dateRange: {
    start: Date;
    end: Date;
  };
  claimsLimit: number;
  journals: string[];
  platforms: string[];
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export interface Product {
  name: string;
  type: string;
  price?: string;
  verificationStatus: string;
  claims: string[];
}

export interface ResearchReport {
  influencerInfo: {
    bio: string;
    expertise: string[];
    followers: string;
    credentials: string[];
  };
  claims: ResearchClaim[];
  products: Product[];
  revenueAnalysis?: RevenueAnalysis;
}

export interface ResearchClaim {
  id: string;
  claim: string;
  status: VerificationStatus;
  category: string;
  source: string;
  link: string;
  evidence: string;
  date: string;
}

export interface RevenueAnalysis {
  estimatedRevenue: string;
  primarySources: string[];
  partnerships: string[];
}
