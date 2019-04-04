import { Pipe, PipeTransform, Inject } from '@angular/core';

@Pipe({
  name: 'hashratePipe'
})
export class HashratePipe implements PipeTransform {

  metric: string;

  constructor() {  }

  transform(input: string, decimal_places?: number) {

    if(!decimal_places){
      decimal_places = 3;
    }

    let value = (+input);
    if (value > Math.pow(10, 15)) {
      this.metric = "PH/s";
      const string = (value / Math.pow(10, 15)).toFixed(decimal_places) + ' ' + this.metric;
      return string;
    } else if (value > Math.pow(10, 12)) {
      this.metric = "TH/s";
      const string = (value / Math.pow(10, 12)).toFixed(decimal_places) + ' ' + this.metric;
      return string;
    } else {
      this.metric = "H/s";
      const string = value.toFixed(decimal_places) + ' ' + this.metric;
      return string;
    }
  }

}