import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TeamsService } from './services/teams.service';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.css',
})
export class TeamsPage {
  readonly teamsService = inject(TeamsService);
}
