import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private bchToBtc$: Observable<number>;
  private bchToBtcTimestamp = new Date(0);


  private totalHashRate$: Observable<number>;

  private API_KEY = 'FG0GOIHRJX3Z9TPZ';

  constructor(private http: HttpClient) { }

  get btcToEur(): Observable<number> {
    // if bchToBtc is older than 5 min, request it, else serve cached one
    if( this.bchToBtcTimestamp.getTime() < ((new Date()).getTime() - 1000 * 60 *5) ) {
      this.requestBtcToEur();
    }
    return this.bchToBtc$;
  }

  get totalHashRate(): Observable<number> {
    if(!this.totalHashRate$) {
      this.requestTotalHashRate();
    }
    return this.totalHashRate$;
  }

  private requestBtcToEur() {
    // set new timestamp
    this.bchToBtcTimestamp = new Date();
    // request bchToBtc
    this.bchToBtc$ = this.http.get<any>('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=' + this.API_KEY).pipe(
      map(x => + x['Realtime Currency Exchange Rate']['5. Exchange Rate']),
      shareReplay(1)
    );
  }

  private requestTotalHashRate() {
    this.totalHashRate$ = this.http.get<number>("https://chain.so/api/v2/get_info/btc").pipe(
      map(x => + x['data']['hashrate']),
      shareReplay(1)
    );
  }
}
