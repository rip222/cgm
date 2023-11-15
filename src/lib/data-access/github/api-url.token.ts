import { InjectionToken } from '@angular/core';

export const GITHUB_API_URL = new InjectionToken<string>('github.api.url', {
  providedIn: 'root',
  factory: () => 'https://api.github.com',
});
