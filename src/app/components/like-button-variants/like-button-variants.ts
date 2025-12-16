import {
  Component,
  signal,
  input,
  output,
  afterNextRender,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { animate } from 'motion';

export type LikeVariant = 'heart' | 'thumbs' | 'star' | 'bookmark';

@Component({
  selector: 'app-single-like-button',
  template: `
    <button
      #button
      class="relative p-3 rounded-full hover:bg-gray-100 transition-colors"
      (click)="toggle()"
    >
      <div #iconWrapper>
        @switch (variant()) {
          @case ('heart') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-red-500' : 'text-gray-400'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          }
          @case ('thumbs') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-blue-500' : 'text-gray-400'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          }
          @case ('star') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-yellow-500' : 'text-gray-400'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
          @case ('bookmark') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-purple-500' : 'text-gray-400'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          }
        }
      </div>

      <!-- Ring effect container -->
      <div #ringContainer class="absolute inset-0 pointer-events-none"></div>
      <!-- Particles container -->
      <div #particlesContainer class="absolute inset-0 pointer-events-none"></div>
    </button>
  `,
})
export class SingleLikeButton {
  // Inputs
  readonly variant = input.required<LikeVariant>();
  readonly initialLiked = input(false);

  // Outputs
  readonly likedChange = output<{ variant: LikeVariant; liked: boolean }>();

  protected readonly isLiked = signal(false);

  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly iconWrapper = viewChild<ElementRef<HTMLDivElement>>('iconWrapper');
  private readonly ringContainer = viewChild<ElementRef<HTMLDivElement>>('ringContainer');
  private readonly particlesContainer = viewChild<ElementRef<HTMLDivElement>>('particlesContainer');

  private readonly colorMap: Record<LikeVariant, string> = {
    heart: 'red',
    thumbs: 'blue',
    star: 'yellow',
    bookmark: 'purple',
  };

  constructor() {
    effect(() => {
      this.isLiked.set(this.initialLiked());
    });

    afterNextRender(() => {
      this.setupButtonAnimation();
    });
  }

  private setupButtonAnimation() {
    const btn = this.button()?.nativeElement;
    if (!btn) return;

    btn.addEventListener('mousedown', () => {
      animate(btn, { scale: 0.85 }, { duration: 0.1 });
    });

    btn.addEventListener('mouseup', () => {
      animate(btn, { scale: 1 }, { duration: 0.1 });
    });

    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1 }, { duration: 0.1 });
    });
  }

  protected toggle() {
    const wasLiked = this.isLiked();
    this.isLiked.set(!wasLiked);

    if (!wasLiked) {
      this.playLikeAnimation();
    }

    this.likedChange.emit({ variant: this.variant(), liked: !wasLiked });
  }

  private playLikeAnimation() {
    const iconWrapper = this.iconWrapper()?.nativeElement;
    if (iconWrapper) {
      animate(
        iconWrapper,
        {
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, -10, 0],
        },
        { duration: 0.5 }
      );
    }

    this.createRingEffect();
    this.createParticles();
  }

  private createRingEffect() {
    const container = this.ringContainer()?.nativeElement;
    if (!container) return;

    const color = this.colorMap[this.variant()];
    const ring = document.createElement('div');
    ring.className = `absolute inset-0 rounded-full border-4 border-${color}-500`;
    ring.style.transform = 'scale(0)';
    ring.style.opacity = '1';
    container.appendChild(ring);

    animate(ring, { scale: [0, 2], opacity: [1, 0] }, { duration: 0.6 }).then(() => {
      ring.remove();
    });
  }

  private createParticles() {
    const container = this.particlesContainer()?.nativeElement;
    if (!container) return;

    const color = this.colorMap[this.variant()];

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 rounded-full bg-${color}-500`;
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.transform = 'translate(-50%, -50%) scale(0)';
      container.appendChild(particle);

      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * 30;
      const y = Math.sin(angle) * 30;

      animate(
        particle,
        {
          scale: [0, 1, 0],
          x: [0, x],
          y: [0, y],
        },
        { duration: 0.6, delay: i * 0.05 }
      ).then(() => {
        particle.remove();
      });
    }
  }
}

@Component({
  selector: 'app-like-button-variants',
  imports: [SingleLikeButton],
  templateUrl: './like-button-variants.html',
})
export class LikeButtonVariants {
  protected onLikeChange(event: { variant: LikeVariant; liked: boolean }) {
    console.log('LikeButtonVariants:', event);
  }
}
