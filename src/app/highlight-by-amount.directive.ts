import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

@Directive({
  selector: '[appHighlightByAmount]',
  standalone: true,
})
export class HighlightByAmount implements OnInit {
  amount = input.required<number>({ alias: 'appHighlightByAmount' });
  private elementRef = inject(ElementRef);
  borderColor = signal('');

  setDefaultColor() {
    this.elementRef.nativeElement.style.color =
      this.amount() > 0 ? '#45a049' : '#a04545';
  }

  ngOnInit() {
    this.setDefaultColor();
  }

  updateBorderColor = () => {
    if (this.amount() > 0) {
      if (this.amount() < 500) {
        this.borderColor.set('#5bff63');
      } else if (this.amount() > 500 && this.amount() < 1000) {
        this.borderColor.set('#45a049');
      } else {
        this.borderColor.set('#295f2c');
      }
    } else {
      if (this.amount() > -500) {
        this.borderColor.set('#d70000');
      } else if (this.amount() < -500 && this.amount() > -1000) {
        this.borderColor.set('#b80000');
      } else if (this.amount() < -1000) {
        this.borderColor.set('#8b0000');
      }
    }
  };

  @HostListener('mouseenter') onMouseEnter() {
    this.updateBorderColor();
    this.elementRef.nativeElement.style.backgroundColor = this.borderColor();
    this.elementRef.nativeElement.style.color = 'white';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.backgroundColor = '';
    this.setDefaultColor();
  }
}
