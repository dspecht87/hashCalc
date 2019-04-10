import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator2',
  templateUrl: './calculator2.component.html',
  styleUrls: ['./calculator2.component.scss']
})
export class Calculator2Component implements OnInit {

  // energy in kWh
  public energy = 100;

  // power efficiency in J/TH
  public powerEfficiency = 59;
  // hash in terahash
  public hash: number;

  public bitcoin;
  public euro;

  constructor() { }

  ngOnInit() {
    this.clac();
  }

  valuesChanged(e) {
    this.clac();
  }

  clac() {
    this.hash = this.energy * this.powerEfficiency *60 * 60;
  }

}
