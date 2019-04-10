import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';
import { Calculator2Component } from './calculator2/calculator2.component';

const routes: Routes = [
  { path: '', redirectTo: '/timeSpan', pathMatch: 'full' },
  { path: 'time-span', component: CalculatorComponent },
  { path: 'moment', component: Calculator2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
