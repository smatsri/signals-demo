import { SlicePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TeamsService } from './services/teams.service';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.css',
})
export class TeamsPage implements OnInit {
  readonly teamsService = inject(TeamsService);

  ngOnInit(): void {
    this.teamsService.loadTeams();
  }
}
