import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { RepositoryService } from '../../data-access/github';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    RouterLink,
  ],
})
export class ReposComponent {
  readonly #repoService = inject(RepositoryService);

  readonly languages = ['Java', 'Typescript', 'Rust'] as const;
  readonly columns = [
    'name',
    'owner',
    'created_at',
    'stargazers_count',
  ] as const;

  readonly repoName = new FormControl('');
  readonly numOfStars = new FormControl(0);
  readonly selectedLanguage = new FormControl('');

  readonly repos$ = combineLatest([
    this.#listenToValueChanges(this.repoName),
    this.#listenToValueChanges(this.numOfStars),
    this.#listenToValueChanges(this.selectedLanguage),
  ]).pipe(
    switchMap(([query, minStars, language]) =>
      !query
        ? of([])
        : this.#repoService.getRepos({
            query,
            minStars: minStars ? +minStars : 0,
            language,
            pageSize: 10,
          })
    )
  );

  #listenToValueChanges(control: FormControl): Observable<string> {
    return control.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      startWith(control.value)
    );
  }
}
