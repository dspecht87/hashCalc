import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ExchangeRateService } from '../_services/exchange-rate.service';

@Pipe({name: 'commaSeparatedNumber'})
export class CommaSeparatedNumberPipe implements PipeTransform {
  transform(value:number, args:string[]) : any {
    return 'fu'
  }
}

@Component({
  selector: 'app-calculator2',
  templateUrl: './calculator2.component.html',
  styleUrls: ['./calculator2.component.scss']
})
export class Calculator2Component implements OnInit {

  // energy in kWh
  public energy = 1;

  // power efficiency in J/TH
  public powerEfficiency = 59;
  // hash in terahash
  public hash: number;


  // total hashpower
  public totalHashPower = 42585056;
  public blockReward = 12.5;
  
  public btcToEur = 4200;

  public bitcoin;
  public euro;

  constructor(private _exchangeRateService: ExchangeRateService) { }

  ngOnInit() {
    this.clac();

    this._exchangeRateService.totalHashRate.subscribe(totalHashPower => {
      this.totalHashPower = totalHashPower / 1000;
      this.clac();
    });

    this._exchangeRateService.btcToEur.subscribe(btcToEur => {
      this.btcToEur = btcToEur;
      this.clac();
    });

    
  }

  valuesChanged(e) {
    this.clac();
  }

  clac() {
    this.hash = this.energy * 1000 * 60 * 60 / this.powerEfficiency;

    // TH/BTC
    // (total hash * Th / s) / (25 * BTC / (600 * s) )
    this.bitcoin = this.hash / ( this.totalHashPower / (this.blockReward / 600));

    this.euro = this.bitcoin * this.btcToEur;
    
  }

}
