import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'app-bloodbank-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bloodbank-dashboard.component.html',
  styleUrl: './bloodbank-dashboard.component.scss'
})
export class BloodbankDashboardComponent {
  donationsOverTimeChartData = [{ data: [21, 32, 28, 43, 29, 0], label: 'Doações' }];
  donationsOverTimeChartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
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

  bloodTypeChartType = 'doughnut' as keyof ChartTypeRegistry;
  bloodTypeChartData = {
    labels: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'],
    datasets: [
      {
        label: 'Bolsas disponíveis',
        data: [12, 4, 7, 2, 3, 1, 18, 5],
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
}
