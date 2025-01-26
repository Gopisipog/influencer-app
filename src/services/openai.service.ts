import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import OpenAI from 'openai';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: environment.openAiApiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async analyze(content: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a health and wellness content analyzer, specialized in fact-checking influencer claims." },
          { role: "user", content: content }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
}
