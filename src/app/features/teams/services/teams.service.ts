import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Team } from '../team.model';

const API_URL =
  'https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=NBA';

interface TheSportsDbTeam {
  idTeam: string;
  strTeam: string;
  strTeamShort: string;
  strStadium: string | null;
  strLocation: string | null;
  strDescriptionEN: string | null;
  strBadge: string | null;
  strFanart1: string | null;
}

interface TheSportsDbResponse {
  teams: TheSportsDbTeam[] | null;
}

function mapToTeam(raw: TheSportsDbTeam): Team {
  return {
    id: raw.idTeam,
    name: raw.strTeam,
    shortName: raw.strTeamShort,
    stadium: raw.strStadium ?? '',
    location: raw.strLocation ?? '',
    description: raw.strDescriptionEN ?? '',
    badgeUrl: raw.strBadge ?? null,
    fanartUrl: raw.strFanart1 ?? null,
  };
}

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly http = inject(HttpClient);

  readonly teams = signal<Team[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadTeams(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<TheSportsDbResponse>(API_URL).subscribe({
      next: (res) => {
        const list = res.teams ?? [];
        this.teams.set(list.map(mapToTeam));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load teams');
        this.loading.set(false);
      },
    });
  }
}

