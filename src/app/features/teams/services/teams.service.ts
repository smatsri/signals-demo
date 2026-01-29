import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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

  readonly teamsResource = rxResource({
    defaultValue: [] as Team[],
    loader: () =>
      this.http
        .get<TheSportsDbResponse>(API_URL)
        .pipe(map((res) => (res.teams ?? []).map(mapToTeam))),
  });

  readonly errorMessage = computed(() => {
    const err = this.teamsResource.error();
    return err instanceof Error ? err.message : err != null ? String(err) : null;
  });
}
