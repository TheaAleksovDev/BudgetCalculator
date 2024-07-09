import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetInputsComponent } from './components/budget-inputs/budget-inputs.component';
import { BudgetDisplayComponent } from './components/budget-display/budget-display.component';
import { Role } from './interfaces/role.type';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    BudgetInputsComponent,
    BudgetDisplayComponent,
    SettingsComponent,
  ],
})
export class AppComponent {
  private settingsService = inject(SettingsService);
  role = signal<Role>('admin');

  constructor() {
    effect(
      () => {
        this.role.set(this.settingsService.getSelectedRole());
      },
      { allowSignalWrites: true }
    );
  }
  title = 'budget-calculator';
}
