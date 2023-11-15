import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GITHUB_API_URL } from './api-url.token';
import { CommitDto, GitHubSeachResponse } from './github.model';

@Injectable({
  providedIn: 'root',
})
export class CommitService {
  readonly #url = inject(GITHUB_API_URL);
  readonly #http = inject(HttpClient);

  getCommits(owner: string, repo: string) {
    const fullUrl = `${this.#url}/repos/${owner}/${repo}/commits`;
    return this.#http.get<CommitDto[]>(fullUrl);
  }

  search(options: GithubCommitSearchOptions): Observable<CommitDto[]> {
    const fullQuery = this.#buildQuery(options);
    const fullUrl = `${this.#url}/search/commits?${fullQuery}`;
    return this.#http
      .get<GitHubSeachResponse<CommitDto>>(fullUrl)
      .pipe(map((commits) => commits.items));
  }

  #buildQuery(options: GithubCommitSearchOptions): string {
    let query = `q=repo:${options.owner}/${options.repo}+${options.query}`;

    if (options.pageSize) {
      query += `&per_page=${options.pageSize}`;
    }

    return query;
  }
}

type GithubCommitSearchOptions = {
  owner: string;
  repo: string;
  query: string;
  pageSize?: number;
};
