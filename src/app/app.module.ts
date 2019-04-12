import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { Calculator2Component } from './calculator2/calculator2.component';

import { HashratePipe } from './_util/hashratePipe';
import { EnergyPipe } from './_util/energyPipe';
import { numbersOnlyDirective } from './_util/number.directive';

import { ExchangeRateService } from './_services/exchange-rate.service';




@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    HashratePipe,
    EnergyPipe,
    Calculator2Component,
    numbersOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSliderModule,
    MatCardModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSelectModule,
    ChartsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTabsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-US", },
    ExchangeRateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
