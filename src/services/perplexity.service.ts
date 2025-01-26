import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PerplexityResponse } from '../app/models/types';

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {
  private apiUrl = 'https://api.perplexity.ai/chat/completions';
  private apiKey = environment.perplexityApiKey;

  constructor(private http: HttpClient) {}

  getResponse(prompt: string): Observable<PerplexityResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

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
