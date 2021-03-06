import { Component, OnInit, LOCALE_ID, Inject, ApplicationRef, ViewChild } from '@angular/core';
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

  Math = Math;

  public MINERS = MINERS;

  selectedMiner: Miner = MINERS[0];

  // time in years
  public time = 4;

  // available energy in kw
  public energy = 9000;

  // // revenue without bitcoin
  // price per kwh in euro
  public energyPrice = 0.05;

  public totalRevenueWithoutBtc = 0;

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
  // total euro
  public totalRevenueEuro = 0;
  public totalBitcoin = 0;

  // less/more profitable with bitcoin in %
  public profitabilityWithBitcoin = 0;

  // chart
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'without Bitcoin' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'with Bitcoin' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    tooltips: {
      callbacks: {
        title: function (tooltipItems, data) {
          console.log(tooltipItems);
          return 'After ' + tooltipItems[0].xLabel + ' years:'
        },
        label: function(tooltipItems, data) { 
            return new DecimalPipe('en-US').transform(tooltipItems.yLabel, '1.0-0') + ' €';
        }
      }
    },
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
        console.log(totalHashRate);
        // tera 1000^4
        this.totalHashRate = (+ totalHashRate) / 1000 / 1000 / 1000 / 1000;
        this.calc();
      })
    });
  }

  energyChanged(e) {
    this.calc();
  }

  calc() {
    this.calcWithourBtc();
    this.calcWithBtc();
    this.generateLabels();

    this.profitabilityWithBitcoin = this.totalRevenueEuro / this.totalRevenueWithoutBtc;
  }

  getBlockReward(time: Date): number {
    return 0;
  }

  calcWithourBtc() {
    // generate data for without bitcoin
    this.totalRevenueWithoutBtc = 0;
    let dataWithoutBTC = [];
    for (let i = 0; i <= this.time; i++) {

      const revenue = i * 8760 * this.energy * this.energyPrice;

      dataWithoutBTC = dataWithoutBTC.concat(revenue);
      this.totalRevenueWithoutBtc = revenue;
    }
    this.lineChartData[0].data = dataWithoutBTC;
  }

  calcWithBtc() {
    // next block reward halving: 24 May 2020 01:19:43
    let halvingDate = new Date(1590275983000);

    // generate data for with bitcoin

    this.hashRate = this.energy * (1 / this.selectedMiner.powerEfficiency * 1000);

    let blockReward = 12.5;

    console.log(this.hashRate);
    console.log(this.totalHashRate + this.hashRate);
    console.log(this.hashRate / (this.totalHashRate + this.hashRate));

    this.bitcoinIncome = this.hashRate / (this.totalHashRate + this.hashRate) * 365 * 144 * blockReward;
    this.euroIncome = this.bitcoinIncome * this.bitcoinPrice;

    let dataWithBTC = [];

    let timeCursor = new Date();

    const initialCost = this.hashRate * (this.selectedMiner.price / this.selectedMiner.hashRate);
    dataWithBTC[0] = -initialCost;


    let totalHashRateDyn = this.totalHashRate;
    this.totalRevenueEuro = 0;
    this.totalBitcoin = 0;

    for (let i = 1; i <= this.time; i++) {

      //increment time cursor + 1 year
      let oldTime = new Date(timeCursor.getTime());
      timeCursor.setFullYear(timeCursor.getFullYear() + 1);

      totalHashRateDyn = totalHashRateDyn * 1.20;

      // year with halving
      if (halvingDate.getTime() < timeCursor.getTime()) {
        let euroDelta = 0;

        // get fraction of year
        let fractionOfYear = (halvingDate.getTime() - oldTime.getTime()) / (timeCursor.getTime() - oldTime.getTime())

        euroDelta = fractionOfYear * this.hashRate / (totalHashRateDyn + this.hashRate) * 8760 * 6 * blockReward * this.bitcoinPrice * (1 / (1 - this.phi));

        blockReward = blockReward / 2;

        // get blocks with new reward
        euroDelta += (1 - fractionOfYear) * this.hashRate / (totalHashRateDyn + this.hashRate) * 8760 * 6 * blockReward * this.bitcoinPrice * (1 / (1 - this.phi));

        this.totalRevenueEuro = dataWithBTC[i - 1] + euroDelta;

        halvingDate.setFullYear(halvingDate.getFullYear() + 4);

        // year without halving
      } else {

        const bitcoinDelta = this.hashRate / (totalHashRateDyn + this.hashRate) * 8760 * 6 * blockReward;

        const euroDelta = bitcoinDelta * this.bitcoinPrice * (1 / (1 - this.phi));

        this.totalRevenueEuro = dataWithBTC[i - 1] + euroDelta;

      }

      dataWithBTC = dataWithBTC.concat(this.totalRevenueEuro);

      this.totalBitcoin += this.totalRevenueEuro / this.bitcoinPrice;

    }
    this.lineChartData[1].data = dataWithBTC;
  }

  generateLabels() {
    // generate labels
    let labels = [];
    for (let i = 0; i <= this.time; i++) {
      labels = labels.concat(i.toString());
    }
    this.lineChartLabels = labels;
  }

  addYear() {
    this.time++;
    this.calc();
  }

  minusYear() {
    this.time--;
    this.calc();
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'M';
    }

    return value + 'k';
  }

}

