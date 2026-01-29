import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Team } from '../team.model';

const API_URL =
  'https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=NBA';
const TEAM_LOOKUP_URL =
  'https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=';

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

  getTeams(): Observable<Team[]> {
    return this.http
      .get<TheSportsDbResponse>(API_URL)
      .pipe(map((res) => (res.teams ?? []).map(mapToTeam)));
  }

  getTeamById(id: string): Observable<Team | null> {
    return this.http.get<TheSportsDbResponse>(`${TEAM_LOOKUP_URL}${id}`).pipe(
      map((res) => {
        const first = res.teams?.[0];
        return first ? mapToTeam(first) : null;
      })
    );
  }
}
