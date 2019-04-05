import { Pipe, PipeTransform, Inject } from '@angular/core';

@Pipe({
  name: 'energyPipe'
})
export class EnergyPipe implements PipeTransform {

  metric: string;

  constructor() {  }

  transform(input: string, decimal_places?: number) {

    if(!decimal_places){
      decimal_places = 3;
    }

    let value = (+input);
    if (value > Math.pow(10, 4)) {
      this.metric = "mW";
      const string = (value / Math.pow(10, 4)).toFixed(decimal_places) + ' ' + this.metric;
      return string;
    } else {
      this.metric = "kW";
      const string = value + ' ' + this.metric;
      return string;
    }
  }

}