import { Component, OnInit, OnChanges, LOCALE_ID, Inject } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DecimalPipe } from '@angular/common';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  //debug switch
  public debug = true;

  // available energy in kw
  public energy = 9000;

  // // revenue without bitcoin
  // price per kwh in euro
  public energyPrice = 0.05;

  // // revenue with bitcoin
  // hashrate per kwh
  // public hashratePerEnergy =  1 / 53 * 1000;

  // power efficiency in J/TH
  public powerEfficiency = 57;

  public hashRate: number;
  public totalHashRate = 44000000;
  // bitcoin income per year
  public bitcoinIncome: number;
  public euroIncome: number;

  // bitcoin price in euro
  public bitcoinPrice = 4215.93;
  // wartungskosten in %
  public phi = 0.1;


  // chart
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'without Bitcoin' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'with Bitcoin' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Years'
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value: number, index, values) {
              return new DecimalPipe('en-US').transform(value) + ' €';
            }
          }
        }
      ]
    },
    annotation: {
      annotations: [],
    },
  };
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  constructor(@Inject(LOCALE_ID) public locale: string) { }

  ngOnInit() {
    this.calc();
  }

  energyChanged(e) {
    console.log(e);
    this.calc();

  }

  calc() {

    // time in years
    const time = 5;


    // generate data for without bitcoin
    let dataWithoutBTC = [];
    for (let i = 0; i < time; i++) {

      const value = i * 8760 * this.energy * this.energyPrice;
      dataWithoutBTC = dataWithoutBTC.concat(value);
    }
    console.log("dataWithoutBTC:");
    console.log(dataWithoutBTC);
    this.lineChartData[0].data = dataWithoutBTC;

    // generate data for with bitcoin

    this.hashRate = this.energy * (1 / this.powerEfficiency * 1000);
    this.bitcoinIncome = this.hashRate / (this.totalHashRate + this.hashRate) * 8760 * 6 * 12.5;
    this.euroIncome = this.bitcoinIncome * this.bitcoinPrice;

    let dataWithBTC = [];
    for (let i = 0; i < time; i++) {
      const initialCost = this.hashRate * 50;

      const value = i * this.euroIncome * (1 / (1 - this.phi))
        - initialCost;
      dataWithBTC = dataWithBTC.concat(value);
    }
    console.log("dataWithBTC:");
    console.log(dataWithBTC);
    this.lineChartData[1].data = dataWithBTC;

    // generate labels
    let labels = [];
    for (let i = 0; i < time; i++) {
      labels = labels.concat(+i);
    }
    this.lineChartLabels = labels;
  }

}

