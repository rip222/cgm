import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommitService } from '../../data-access/github';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  styleUrls: ['./commits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,
    DatePipe,
    RouterLink,
  ],
})
export class CommitsComponent {
  readonly #route = inject(ActivatedRoute);

  readonly #allCommits = this.#route.snapshot.data['commits'];

  readonly #repo = this.#route.snapshot.queryParamMap.get('repo')!;
  readonly #owner = this.#route.snapshot.queryParamMap.get('owner')!;

  readonly #commitService = inject(CommitService);

  readonly query$ = new BehaviorSubject<string>('');
  readonly columns = ['committer', 'url', 'message'] as const;

  readonly commits$ = this.query$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((query) =>
      !query
        ? of(this.#allCommits)
        : this.#commitService.search({
            query,
            repo: this.#repo,
            owner: this.#owner,
            pageSize: 10,
          })
    )
  );

  onQuery(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.query$.next(input.value);
  }
}
