import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Influencer } from '../app/models/types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  private apiUrl = `${environment.perplexityApiKey}/influencers`;

  constructor(private http: HttpClient) {}

  getInfluencers(): Observable<Influencer[]> {
    return this.http.get<Influencer[]>(this.apiUrl);
  }

  getInfluencerById(id: string): Observable<Influencer> {
    return this.http.get<Influencer>(`${this.apiUrl}/${id}`);
  }
}
