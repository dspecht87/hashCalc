import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  navLinks: any[];
  activeLinkIndex = -1; 

  constructor(private router: Router) {
    this.navLinks = [
        {
            label: 'Time Period',
            link: './time-period',
            index: 0
        }, {
            label: 'Moment',
            link: './moment',
            index: 1
        }
    ];
}

}
