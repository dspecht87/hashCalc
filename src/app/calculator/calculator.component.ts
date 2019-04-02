import { Component, OnInit, OnChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnChanges {

  //debug switch
  public debug = true;

  // available energy in kwh
  public energy = 300;
  
  // // revenue without bitcoin
  // price per kwh in euro
  public energyPrice = 0.08;

  // // revenue with bitcoin
  // hashrate per kwh
  public hashratePerEnergy =  1 / 53 * 1000;
  // bitcoin per hashrate
  public bitcoinPerHashrate = 1 / 44000000 * 6 * 12.5;
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
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
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

  constructor() { }

  ngOnInit() {
    this.calc();
  }

  energyChanged(e) {
    console.log(e);
    this.calc();

  }

  calc() {
   
    // time in years
    const time = 6;


    // generate data for without bitcoin
    let dataWithoutBTC = [];
    for(let i = 0; i < time; i++){
      
      const value = i * 8760 * this.energy* this.energyPrice;
      dataWithoutBTC = dataWithoutBTC.concat(value);
    }
    console.log("dataWithoutBTC:");
    console.log(dataWithoutBTC);
    this.lineChartData[0].data = dataWithoutBTC;


    // generate data for with bitcoin
    let dataWithBTC = [];
    for(let i = 0; i < time; i++){
      const initialCost = this.energy * this.hashratePerEnergy * 150;
      
      const value = i * 8760 * this.energy * this.hashratePerEnergy * this.bitcoinPerHashrate * this.bitcoinPrice * (1/ (1 - this.phi))
       - initialCost;
      dataWithBTC = dataWithBTC.concat(value);
    }
    console.log("dataWithBTC:");
    console.log(dataWithBTC);
    this.lineChartData[1].data = dataWithBTC;

    // generate labels
    let labels = [];
    for(let i = 0; i < time; i++){
      labels = labels.concat(+i);
    }
    this.lineChartLabels = labels;
  }

  ngOnChanges(){
    
  }

}