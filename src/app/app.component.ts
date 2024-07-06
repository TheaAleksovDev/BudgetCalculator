import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetInputsComponent } from './components/budget-inputs/budget-inputs.component';
import { BudgetDisplayComponent } from './components/budget-display/budget-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, BudgetInputsComponent, BudgetDisplayComponent],
})
export class AppComponent {
  title = 'bugdet-calculator';
}
