import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { PerplexityResponse } from '../app/models/types';

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {
  private apiUrl = 'https://api.perplexity.ai/chat/completions';
  private apiKey: string | null = null;

  constructor(private http: HttpClient) {
    this.apiKey = localStorage.getItem('perplexity_api_key') || environment.perplexityApiKey;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('perplexity_api_key', key);
  }

  getResponse(prompt: string): Observable<PerplexityResponse> {
    if (!this.apiKey) {
      return throwError(() => new Error('API_KEY_REQUIRED'));
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.apiKey}`)
      .set('Content-Type', 'application/json');

    const body = {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        { role: "system", content: "Be precise and concise." },
        { role: "user", content: prompt }
      ]
    };

    return this.http.post<PerplexityResponse>(this.apiUrl, body, { headers });
  }
}
