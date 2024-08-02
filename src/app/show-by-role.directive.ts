import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Role } from './models/budget-calculator.model';

@Directive({
  selector: '[appShowByRole]',
  standalone: true,
})
export class AppShowByRoleDirective {
  role = input.required<Role>({ alias: 'appShowByRole' });
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      switch (this.role()) {
        case 'admin':
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          break;
        case 'guest':
          this.viewContainerRef.clear();
          break;
      }
    });
  }
}
