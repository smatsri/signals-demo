import { SlicePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Team } from './team.model';
import { TeamsService } from './services/teams.service';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.css',
})
export class TeamsPage {
  private readonly teamsService = inject(TeamsService);

  readonly teamsResource = rxResource({
    defaultValue: [] as Team[],
    loader: () => this.teamsService.getTeams(),
  });

  readonly teams = computed(() => this.teamsResource.value());

  readonly errorMessage = computed(() => {
    const err = this.teamsResource.error();
    return err instanceof Error ? err.message : err != null ? String(err) : null;
  });
}
