import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Team } from '../team.model';

const API_URL =
  'https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=NBA';
const TEAM_LOOKUP_URL =
  'https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

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

function isCacheValid<T>(entry: { data: T; expiry: number } | null): entry is { data: T; expiry: number } {
  return entry !== null && Date.now() < entry.expiry;
}

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly http = inject(HttpClient);
  private teamsCache: { data: Team[]; expiry: number } | null = null;
  private readonly teamByIdCache = new Map<string, { data: Team | null; expiry: number }>();

  getTeams(): Observable<Team[]> {
    if (isCacheValid(this.teamsCache)) {
      return of(this.teamsCache.data);
    }
    return this.http.get<TheSportsDbResponse>(API_URL).pipe(
      map((res) => (res.teams ?? []).map(mapToTeam)),
      tap((teams) => {
        this.teamsCache = { data: teams, expiry: Date.now() + CACHE_TTL_MS };
      })
    );
  }

  getTeamById(id: string): Observable<Team | null> {
    const cached = this.teamByIdCache.get(id);
    if (cached && Date.now() < cached.expiry) {
      return of(cached.data);
    }
    return this.http.get<TheSportsDbResponse>(`${TEAM_LOOKUP_URL}${id}`).pipe(
      map((res) => {
        const first = res.teams?.[0];
        return first ? mapToTeam(first) : null;
      }),
      tap((team) => {
        this.teamByIdCache.set(id, { data: team, expiry: Date.now() + CACHE_TTL_MS });
      })
    );
  }
}
