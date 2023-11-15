import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GITHUB_API_URL } from './api-url.token';
import { GitHubSeachResponse, RepositoryDto } from './github.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  readonly #url = inject(GITHUB_API_URL);
  readonly #http = inject(HttpClient);

  getRepos(options: GithubRepoSearchOptions): Observable<RepositoryDto[]> {
    const fullQuery = this.#buildQuery(options);
    const fullUrl = `${this.#url}/search/repositories?${fullQuery}`;
    return this.#http
      .get<GitHubSeachResponse<RepositoryDto>>(fullUrl)
      .pipe(map((response) => response.items));
  }

  #buildQuery(options: GithubRepoSearchOptions): string {
    let query = `q=${options.query}`;

    if (options.language) {
      query += `+language:${options.language}`;
    }

    if (options.minStars) {
      query += `+stars:>${options.minStars}`;
    }

    if (options.pageSize) {
      query += `&per_page=${options.pageSize}`;
    }

    return query;
  }
}

type GithubRepoSearchOptions = {
  query: string;
  pageSize?: number;
  language?: string;
  minStars?: number;
};
