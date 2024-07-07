import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetInputsComponent } from './components/budget-inputs/budget-inputs.component';
import { BudgetDisplayComponent } from './components/budget-display/budget-display.component';
import { Role } from './interfaces/role.type';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, BudgetInputsComponent, BudgetDisplayComponent],
})
export class AppComponent {
  role = signal<Role>('admin');
  title = 'budget-calculator';
}
