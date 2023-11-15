import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { CommitDto, CommitService } from '@lib/data-access/github';
import { EMPTY } from 'rxjs';

export const commitsResolver: ResolveFn<CommitDto[]> = (
  route: ActivatedRouteSnapshot
) => {
  const commitsService = inject(CommitService);
  const router = inject(Router);
  const owner = route.queryParamMap.get('owner');
  const repo = route.queryParamMap.get('repo');
  if (!owner || !repo) {
    router.navigate(['/']);
    return EMPTY;
  }
  return commitsService.getCommits(owner, repo);
};
