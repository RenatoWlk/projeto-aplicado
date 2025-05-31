import { Component, OnInit } from '@angular/core';
import { Donor, PointUser, LeaderboardsService } from './leaderboards.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboards',
  imports: [CommonModule],
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements OnInit {
  activeTab: 'donors' | 'points' = 'donors';

  topDonors: Donor[] = [];
  topPoints: PointUser[] = [];

  constructor(private leaderboardsService: LeaderboardsService) {}

  ngOnInit(): void {
    this.fetchTopDonors();
    this.fetchTopPoints();
  }

  fetchTopDonors(): void {
    this.leaderboardsService.getTopDonors().subscribe((donors) => {
      this.topDonors = donors;
    });
  }

  fetchTopPoints(): void {
    this.leaderboardsService.getTopPointUsers().subscribe((users) => {
      this.topPoints = users;
    });
  }
}
