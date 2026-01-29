import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of } from 'rxjs';

import { Team } from './team.model';
import { TeamsService } from './services/teams.service';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team.page.html',
  styleUrl: './team.page.css',
})
export class TeamPage {
  private readonly route = inject(ActivatedRoute);
  readonly teamsService = inject(TeamsService);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? undefined)),
    { initialValue: undefined as string | undefined }
  );

  readonly teamResource = rxResource({
    request: () => this.id(),
    defaultValue: null as Team | null,
    loader: ({ request }) =>
      request ? this.teamsService.getTeamById(request) : of(null),
  });

  readonly team = computed(() => this.teamResource.value());

  readonly errorMessage = computed(() => {
    const err = this.teamResource.error();
    return err instanceof Error ? err.message : err != null ? String(err) : null;
  });
}
