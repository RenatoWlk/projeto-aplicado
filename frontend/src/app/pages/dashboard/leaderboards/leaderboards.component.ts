import { Component, OnInit } from '@angular/core';
import { TopDonor, TopPointsUser, LeaderboardsService } from './leaderboards.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboards',
  imports: [CommonModule],
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements OnInit {
  activeTab: 'donors' | 'points' = 'donors';

  topDonors: TopDonor[] = [];
  topPoints: TopPointsUser[] = [];

  constructor(private leaderboardsService: LeaderboardsService) {}

  ngOnInit(): void {
    this.fetchLeaderboards();
  }

  fetchLeaderboards(): void {
    this.leaderboardsService.getLeaderboards().subscribe((leaderboards) => {
      this.topDonors = leaderboards.topDonors;
      this.topPoints = leaderboards.topPointsUsers;
    });
  }
}
