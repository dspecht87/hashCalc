import { Component, OnInit, OnChanges, LOCALE_ID, Inject, ChangeDetectorRef, ApplicationRef, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DecimalPipe } from '@angular/common';
import { MatExpansionPanel } from '@angular/material';
import { ExchangeRateService } from '../_services/exchange-rate.service';
import { MINERS, Miner } from '../_model/miner';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {


  public MINERS = MINERS;

  selectedMiner: Miner = MINERS[0];

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
  // public powerEfficiency = 57;

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
      backgroundColor: 'rgba(100,83,96,0.3)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // green
      backgroundColor: 'rgba(174,204,83,0.1)',
      borderColor: 'rgba(174,204,83,1)',
      pointBackgroundColor: 'rgba(174,204,83,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(174,204,83,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;

  constructor(@Inject(LOCALE_ID) public locale: string, private ref: ApplicationRef,
    private exchangeRateService: ExchangeRateService) { }

  ngOnInit() {
    this.exchangeRateService.btcToEur.subscribe(btcToEur => {
      this.bitcoinPrice = btcToEur;
      this.exchangeRateService.totalHashRate.subscribe(totalHashRate => {
        this.totalHashRate = (+ totalHashRate) / 1000;
        this.calc();
      }) 
    });
  }

  energyChanged(e) {

    console.log(e);
    this.calc();
  }

  calc() {

    // next block reward halving: 24 May 2020 01:19:43
    let halvingDate = new Date(1590275983000);
    console.log(halvingDate);

    // time in years
    const time = 5;


    // generate data for without bitcoin
    let dataWithoutBTC = [];
    for (let i = 0; i < time; i++) {

      const value = i * 8760 * this.energy * this.energyPrice;
      dataWithoutBTC = dataWithoutBTC.concat(value);
    }

    this.lineChartData[0].data = dataWithoutBTC;

    // generate data for with bitcoin

    this.hashRate = this.energy * (1 / this.selectedMiner.powerEfficiency * 1000);

    let blockReward = 12.5;

    this.bitcoinIncome = this.hashRate / (this.totalHashRate + this.hashRate) * 8760 * 6 * 12.5;
    this.euroIncome = this.bitcoinIncome * this.bitcoinPrice;

    let dataWithBTC = [];

    let timeCursor = new Date();

    const initialCost = this.hashRate * (this.selectedMiner.price /  this.selectedMiner.hashRate);
    dataWithBTC[0] = -initialCost;

    for (let i = 1; i < time; i++) {


      //increment time cursor + 1 year
      let oldTime = new Date(timeCursor.getTime());
      timeCursor.setFullYear(timeCursor.getFullYear() + 1);


      let accReward = 0;
      if (halvingDate.getTime() < timeCursor.getTime()) {

        // get fraction of year
        let fractionOfYear = (halvingDate.getTime() - oldTime.getTime()) / (timeCursor.getTime() - oldTime.getTime())

        accReward = fractionOfYear * this.hashRate / (this.totalHashRate + this.hashRate) * 8760 * 6 * blockReward * this.bitcoinPrice * (1 / (1 - this.phi));

        blockReward = blockReward / 2;

        // get blocks with new reward
        accReward += (1 - fractionOfYear) * this.hashRate / (this.totalHashRate + this.hashRate) * 8760 * 6 * blockReward * this.bitcoinPrice * (1 / (1 - this.phi));

        let value = dataWithBTC[i - 1] + accReward;

        halvingDate.setFullYear(halvingDate.getFullYear() + 4);

        dataWithBTC = dataWithBTC.concat(value);

      } else {
        const delta = this.hashRate / (this.totalHashRate + this.hashRate) * 8760 * 6 * blockReward * this.bitcoinPrice * (1 / (1 - this.phi));

        const value = dataWithBTC[i - 1] + delta;

        dataWithBTC = dataWithBTC.concat(value);
      }

    }
    this.lineChartData[1].data = dataWithBTC;

    // generate labels
    let labels = [];
    for (let i = 0; i < time; i++) {
      labels = labels.concat(+i);
    }
    this.lineChartLabels = labels;
  }

}

