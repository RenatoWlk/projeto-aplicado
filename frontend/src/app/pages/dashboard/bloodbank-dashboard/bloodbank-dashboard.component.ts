import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { BloodBankDashboardService, BloodBankStats } from './bloodbank-dashboard.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BloodType } from '../../../shared/app.enums';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-bloodbank-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bloodbank-dashboard.component.html',
  styleUrl: './bloodbank-dashboard.component.scss'
})
export class BloodbankDashboardComponent implements OnInit {
  bloodbankStats: BloodBankStats = {} as any;

  /**
   * Donations over time chart data and configuration.
   * This chart displays the number of donations made over the last 6 months.
   */
  donationsOverTimeChartData = [{ data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'Doações' }];
  donationsOverTimeChartLabels = ['', '', '', '', '', '', '', ''];
  donationsOverTimeChartType = 'line' as keyof ChartTypeRegistry;
  public donationsOverTimeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: 'Poppins, sans-serif',
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Doado em ${context.label}: ${value}`;
          },
        },
      },
    },
  };

  /**
   * Blood type distribution chart data and configuration.
   * This chart displays the number of available blood bags for each blood type.
   */
  bloodTypeChartType = 'doughnut' as keyof ChartTypeRegistry;
  bloodTypeChartData = {
    labels: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'],
    datasets: [
      {
        label: 'Bolsas disponíveis',
        data: [0,0,0,0,0,0,0,0],
        backgroundColor: [
          '#78c2ff', '#ff5365', '#68e9ba', '#ffae78',
          '#9dace9', '#ffff96', '#c992ff', '#BFFCC6'
        ],
      } // deixaram um daltonico escolher as cores
    ]
  };
  public bloodTypeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: 'Poppins, sans-serif',
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Bolsas disponíveis: ${value}`;
          },
        },
      },
    },
  };

  constructor(private bbDashboardService: BloodBankDashboardService, private authService: AuthService) {}

  // Fetch blood bank statistics when the component initializes
  ngOnInit(): void {
    this.getBloodBankStats();
  }

  /**
   * Fetches the blood bank statistics from the server and stores them in the component.
   * This includes total donations, scheduled donations, donations over time, and blood type distribution.
   */
  private getBloodBankStats(): void {
    this.bbDashboardService.getBloodbankStats(this.authService.getCurrentUserId()).subscribe((bloodbankStats: BloodBankStats) => {
      this.bloodbankStats = bloodbankStats;
      this.getDonationsOverTimeChartData();
      this.getBloodTypeChartData();
    });
  }

  /**
   * Processes the donations over time data to prepare it for the chart.
   * It sorts the data by year and month, and extracts the labels and data for the chart.
   */
  private getDonationsOverTimeChartData(): void {
    if (!this.bloodbankStats.donationsOverTime) return;

    const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const sortedData = [...this.bloodbankStats.donationsOverTime].sort((a, b) => {
      const aIndex = a.year * 100 + MONTHS.indexOf(a.month);
      const bIndex = b.year * 100 + MONTHS.indexOf(b.month);
      return aIndex - bIndex;
    });

    const last8 = sortedData.slice(-8);

    this.donationsOverTimeChartLabels = last8.map(item => item.month);
    this.donationsOverTimeChartData = [{
      data: last8.map(item => item.donations),
      label: 'Doações'
    }];
  }

  /**
   * Processes the blood type distribution data to prepare it for the chart.
   * It extracts the labels and data for the chart based on the blood type distribution.
   */
  private getBloodTypeChartData(): void {
    if (!this.bloodbankStats.bloodTypeBloodBags) return;

    const labels = Object.keys(this.bloodbankStats.bloodTypeBloodBags);
    const data = labels.map(label => this.bloodbankStats.bloodTypeBloodBags[label as keyof typeof BloodType]);

    this.bloodTypeChartData = {
      labels,
      datasets: [{
        label: 'Bolsas disponíveis',
        data,
        backgroundColor: [
          '#78c2ff', '#ff5365', '#68e9ba', '#ffae78',
          '#9dace9', '#ffff96', '#c992ff', '#BFFCC6'
        ],
      }]
    };
  }
}
