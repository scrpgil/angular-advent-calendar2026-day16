import {
  Component,
  afterNextRender,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
})
export class LoadingSpinner implements OnDestroy {
  private readonly outerRing = viewChild<ElementRef<HTMLDivElement>>('outerRing');
  private readonly spinner = viewChild<ElementRef<HTMLDivElement>>('spinner');
  private readonly text = viewChild<ElementRef<HTMLParagraphElement>>('text');

  private outerRingAnimation: ReturnType<typeof animate> | null = null;
  private spinnerAnimation: ReturnType<typeof animate> | null = null;
  private textAnimation: ReturnType<typeof animate> | null = null;

  constructor() {
    afterNextRender(() => {
      this.setupAnimations();
    });
  }

  ngOnDestroy() {
    this.outerRingAnimation?.stop();
    this.spinnerAnimation?.stop();
    this.textAnimation?.stop();
  }

  private setupAnimations() {
    const outerRingEl = this.outerRing()?.nativeElement;
    if (outerRingEl) {
      this.outerRingAnimation = animate(
        outerRingEl,
        {
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        },
        {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      );
    }

    const spinnerEl = this.spinner()?.nativeElement;
    if (spinnerEl) {
      this.spinnerAnimation = animate(
        spinnerEl,
        { rotate: 360 },
        {
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }
      );
    }

    const textEl = this.text()?.nativeElement;
    if (textEl) {
      this.textAnimation = animate(
        textEl,
        { opacity: [1, 0.5, 1] },
        {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      );
    }
  }
}
