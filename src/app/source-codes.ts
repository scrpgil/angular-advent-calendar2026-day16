// 各コンポーネントのソースコード

export const GITHUB_BASE_URL = 'https://github.com/scrpgil/angular-advent-calendar2026-day16/blob/main/src/app/components';

export const SOURCE_CODES = {
  likeButton: {
    ts: `import {
  Component, signal, computed, afterNextRender,
  ElementRef, viewChild, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.html',
})
export class LikeButton {
  readonly initialLiked = input(false);
  readonly initialCount = input(42);
  readonly likedChange = output<{ liked: boolean; count: number }>();

  protected readonly isLiked = signal(false);
  protected readonly count = signal(42);

  protected readonly heartClass = computed(() =>
    this.isLiked()
      ? 'transition-colors fill-red-500 text-red-500'
      : 'transition-colors text-gray-400'
  );

  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly heartIcon = viewChild<ElementRef<HTMLElement>>('heartIcon');

  constructor() {
    effect(() => {
      this.isLiked.set(this.initialLiked());
      this.count.set(this.initialCount());
    });
    afterNextRender(() => this.setupButtonAnimation());
  }

  protected handleLike() {
    const wasLiked = this.isLiked();
    this.isLiked.set(!wasLiked);
    this.count.update((c) => (wasLiked ? c - 1 : c + 1));
    if (!wasLiked) this.playLikeAnimation();
    this.likedChange.emit({ liked: this.isLiked(), count: this.count() });
  }

  private playLikeAnimation() {
    const heart = this.heartIcon()?.nativeElement;
    if (!heart) return;
    animate(heart, { scale: [1, 1.3, 1] }, { duration: 0.3 });
    this.createRipple();
  }

  private createRipple() {
    const btn = this.button()?.nativeElement;
    if (!btn) return;
    const ripple = document.createElement('div');
    ripple.className = 'absolute inset-0 rounded-full border-4 border-red-500';
    btn.appendChild(ripple);
    animate(ripple, { scale: [0, 2], opacity: [1, 0] }, { duration: 0.6 })
      .then(() => ripple.remove());
  }
}`,
    html: `<div class="flex flex-col items-center gap-2">
  <button #button class="relative p-4 rounded-full bg-gray-100 hover:bg-gray-200" (click)="handleLike()">
    <div #heartIcon [class]="heartClass()">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    </div>
  </button>
  <span #countEl class="text-gray-600">{{ count() }} likes</span>
</div>`,
    github: `${GITHUB_BASE_URL}/like-button`,
  },

  animatedToggle: {
    ts: `import {
  Component, signal, computed, afterNextRender,
  ElementRef, viewChild, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-animated-toggle',
  templateUrl: './animated-toggle.html',
})
export class AnimatedToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  protected readonly buttonBgClass = computed(() =>
    this.isOn() ? 'bg-blue-500' : 'bg-gray-300'
  );

  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnobPosition(this.isOn()));
  }

  protected toggle() {
    const wasOn = this.isOn();
    this.isOn.set(!wasOn);
    this.updateKnobPosition(!wasOn);
    this.toggled.emit(!wasOn);
  }

  private updateKnobPosition(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;
    animate(knobEl, { x: isOn ? 40 : 0 }, { type: 'spring', stiffness: 500, damping: 30 });
  }
}`,
    html: `<div class="flex flex-col items-center gap-4">
  <button class="w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors"
          [class]="buttonBgClass()" (click)="toggle()">
    <div #knob class="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
      @if (isOn()) {
        <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      } @else {
        <svg class="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/>
        </svg>
      }
    </div>
  </button>
  <span class="text-gray-600">{{ labelText() }}</span>
</div>`,
    github: `${GITHUB_BASE_URL}/animated-toggle`,
  },

  pulseButton: {
    ts: `import {
  Component, signal, afterNextRender, ElementRef, viewChild, output,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-pulse-button',
  templateUrl: './pulse-button.html',
})
export class PulseButton {
  readonly clicked = output<void>();

  protected readonly hasNotification = signal(true);
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly badge = viewChild<ElementRef<HTMLDivElement>>('badge');

  constructor() {
    afterNextRender(() => {
      this.startPulseAnimation();
      this.setupButtonAnimation();
    });
  }

  private startPulseAnimation() {
    const badgeEl = this.badge()?.nativeElement;
    if (!badgeEl || !this.hasNotification()) return;
    const pulse = () => {
      animate(badgeEl, { scale: [1, 1.2, 1] }, { duration: 1.5, repeat: Infinity });
    };
    pulse();
  }

  protected handleClick() {
    this.hasNotification.set(!this.hasNotification());
    this.clicked.emit();
    if (this.hasNotification()) {
      setTimeout(() => this.startPulseAnimation(), 100);
    }
  }
}`,
    html: `<div class="flex flex-col items-center gap-4">
  <button #button class="relative p-4 rounded-full bg-gray-100 hover:bg-gray-200" (click)="handleClick()">
    <svg class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
    @if (hasNotification()) {
      <div #badge class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
        <span class="text-white text-xs font-bold">3</span>
      </div>
    }
  </button>
  <span class="text-gray-600">{{ hasNotification() ? '通知あり' : '通知なし' }}</span>
</div>`,
    github: `${GITHUB_BASE_URL}/pulse-button`,
  },

  counterCard: {
    ts: `import {
  Component, signal, afterNextRender, ElementRef, viewChild, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-counter-card',
  templateUrl: './counter-card.html',
})
export class CounterCard {
  readonly initialValue = input(0);
  readonly valueChange = output<number>();

  protected readonly count = signal(0);
  protected readonly displayCount = signal(0);

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      this.count.set(initial);
      this.displayCount.set(initial);
    });

    effect(() => {
      const targetValue = this.count();
      this.animateCounter(targetValue);
    });
  }

  private animateCounter(targetValue: number) {
    const startValue = this.displayCount();
    const duration = 500;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.displayCount.set(Math.round(startValue + (targetValue - startValue) * easeOut));
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
  }

  protected increment() {
    this.count.update((c) => c + 1);
    this.valueChange.emit(this.count());
  }

  protected decrement() {
    this.count.update((c) => c - 1);
    this.valueChange.emit(this.count());
  }
}`,
    html: `<div class="bg-white rounded-2xl shadow-lg p-8 w-64">
  <h3 class="text-center text-gray-600 mb-4">カウンター</h3>
  <div #countDisplay class="text-5xl font-bold text-center text-gray-800 mb-6">{{ displayCount() }}</div>
  <div class="flex justify-center gap-4">
    <button #minusButton class="w-12 h-12 rounded-full bg-red-100 text-red-600 hover:bg-red-200" (click)="decrement()">
      <svg class="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14"/>
      </svg>
    </button>
    <button #plusButton class="w-12 h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200" (click)="increment()">
      <svg class="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14"/><path d="M12 5v14"/>
      </svg>
    </button>
  </div>
</div>`,
    github: `${GITHUB_BASE_URL}/counter-card`,
  },

  loadingSpinner: {
    ts: `import { Component, afterNextRender, ElementRef, viewChildren } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
})
export class LoadingSpinner {
  private readonly dots = viewChildren<ElementRef<HTMLDivElement>>('dot');

  constructor() {
    afterNextRender(() => this.startAnimation());
  }

  private startAnimation() {
    const dotElements = this.dots();
    dotElements.forEach((dotRef, index) => {
      const dot = dotRef.nativeElement;
      animate(
        dot,
        { y: [0, -12, 0], scale: [1, 1.2, 1] },
        { duration: 0.6, delay: index * 0.15, repeat: Infinity, repeatDelay: 0.3 }
      );
    });
  }
}`,
    html: `<div class="flex flex-col items-center gap-4">
  <div class="flex items-center gap-2">
    <div #dot class="w-3 h-3 bg-blue-500 rounded-full"></div>
    <div #dot class="w-3 h-3 bg-blue-500 rounded-full"></div>
    <div #dot class="w-3 h-3 bg-blue-500 rounded-full"></div>
  </div>
  <span class="text-gray-600">読み込み中...</span>
</div>`,
    github: `${GITHUB_BASE_URL}/loading-spinner`,
  },

  progressCard: {
    ts: `import {
  Component, signal, afterNextRender, ElementRef, viewChild, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-progress-card',
  templateUrl: './progress-card.html',
})
export class ProgressCard {
  readonly initialProgress = input(0);
  readonly progressChange = output<number>();
  readonly completed = output<void>();

  protected readonly progress = signal(0);
  protected readonly isUploading = signal(false);
  private readonly progressBar = viewChild<ElementRef<HTMLDivElement>>('progressBar');

  protected simulateUpload() {
    if (this.isUploading()) return;
    this.isUploading.set(true);
    this.progress.set(0);

    const interval = setInterval(() => {
      this.progress.update((p) => {
        const newProgress = Math.min(p + Math.random() * 15, 100);
        this.progressChange.emit(newProgress);
        if (newProgress >= 100) {
          clearInterval(interval);
          this.isUploading.set(false);
          this.completed.emit();
        }
        return newProgress;
      });
      this.animateProgressBar();
    }, 200);
  }

  private animateProgressBar() {
    const bar = this.progressBar()?.nativeElement;
    if (!bar) return;
    animate(bar, { width: \`\${this.progress()}%\` }, { duration: 0.2 });
  }
}`,
    html: `<div class="bg-white rounded-2xl shadow-lg p-6 w-80">
  <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
    <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
    <p class="text-gray-500 text-sm">ドラッグ＆ドロップ</p>
  </div>
  <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
    <div #progressBar class="h-full bg-blue-500 rounded-full" style="width: 0%"></div>
  </div>
  <div class="flex justify-between text-sm text-gray-600 mb-4">
    <span>{{ progress() | number:'1.0-0' }}%</span>
    <span>{{ isUploading() ? 'アップロード中...' : '待機中' }}</span>
  </div>
  <button class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          [disabled]="isUploading()" (click)="simulateUpload()">
    {{ isUploading() ? 'アップロード中...' : 'アップロード開始' }}
  </button>
</div>`,
    github: `${GITHUB_BASE_URL}/progress-card`,
  },

  checkboxAnimation: {
    ts: `import {
  Component, signal, ElementRef, afterNextRender, viewChildren, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-checkbox-animation',
  templateUrl: './checkbox-animation.html',
})
export class CheckboxAnimation {
  readonly initialTasks = input<Task[]>([
    { id: 1, text: 'メールを確認する', completed: false },
    { id: 2, text: '会議の準備をする', completed: false },
    { id: 3, text: 'レポートを提出する', completed: false },
  ]);

  readonly tasksChange = output<Task[]>();
  readonly taskToggled = output<{ task: Task; completed: boolean }>();

  protected readonly tasks = signal<Task[]>([]);
  private readonly checkboxes = viewChildren<ElementRef<HTMLDivElement>>('checkbox');
  private readonly strikethroughs = viewChildren<ElementRef<HTMLSpanElement>>('strikethrough');

  constructor() {
    effect(() => this.tasks.set(this.initialTasks()));
  }

  protected toggleTask(taskId: number, index: number) {
    const task = this.tasks().find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const updatedTasks = this.tasks().map((t) =>
      t.id === taskId ? { ...t, completed: newCompleted } : t
    );

    this.tasks.set(updatedTasks);
    this.animateCheckbox(index, newCompleted);
    this.tasksChange.emit(updatedTasks);
    this.taskToggled.emit({ task: { ...task, completed: newCompleted }, completed: newCompleted });
  }

  private animateCheckbox(index: number, completed: boolean) {
    const checkbox = this.checkboxes()[index]?.nativeElement;
    if (checkbox && completed) {
      animate(checkbox, { scale: [1, 1.2, 1] }, { duration: 0.3 });
    }
  }
}`,
    html: `<div class="bg-white rounded-2xl shadow-lg p-6 w-80">
  <h3 class="font-semibold text-gray-800 mb-4">タスクリスト</h3>
  <div class="space-y-3">
    @for (task of tasks(); track task.id; let i = $index) {
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
           (click)="toggleTask(task.id, i)">
        <div #checkbox class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
             [class]="task.completed ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'">
          @if (task.completed) {
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          }
        </div>
        <span class="relative" [class]="task.completed ? 'text-gray-400' : 'text-gray-700'">
          {{ task.text }}
          <span #strikethrough class="absolute left-0 top-1/2 h-0.5 bg-gray-400"
                [style.width]="task.completed ? '100%' : '0%'"></span>
        </span>
      </div>
    }
  </div>
</div>`,
    github: `${GITHUB_BASE_URL}/checkbox-animation`,
  },

  hoverCard: {
    ts: `import {
  Component, afterNextRender, ElementRef, viewChild, output,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-hover-card',
  templateUrl: './hover-card.html',
})
export class HoverCard {
  readonly buttonClick = output<void>();

  private readonly card = viewChild<ElementRef<HTMLDivElement>>('card');
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');

  constructor() {
    afterNextRender(() => this.setupAnimations());
  }

  private setupAnimations() {
    const cardEl = this.card()?.nativeElement;
    if (cardEl) {
      cardEl.addEventListener('mouseenter', () => {
        animate(cardEl, { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }, { duration: 0.3 });
      });
      cardEl.addEventListener('mouseleave', () => {
        animate(cardEl, { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }, { duration: 0.3 });
      });
    }
  }

  protected onButtonClick() {
    this.buttonClick.emit();
  }
}`,
    html: `<div #card class="bg-white rounded-2xl shadow-lg p-6 w-72 cursor-pointer">
  <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4
              flex items-center justify-center">
    <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  </div>
  <h3 class="font-semibold text-gray-800 mb-2">ホバーカード</h3>
  <p class="text-gray-600 text-sm mb-4">カードにホバーすると浮き上がるエフェクト</p>
  <button #button class="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          (click)="onButtonClick()">詳細を見る</button>
</div>`,
    github: `${GITHUB_BASE_URL}/hover-card`,
  },

  starRating: {
    ts: `import {
  Component, signal, computed, afterNextRender, ElementRef, viewChildren, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.html',
})
export class StarRating {
  readonly initialRating = input(0);
  readonly ratingChange = output<number>();

  protected readonly rating = signal(0);
  protected readonly hover = signal(0);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly displayRating = computed(() => {
    const r = this.rating();
    return r === 0 ? '評価してください' : \`\${r}つ星の評価\`;
  });

  private readonly starButtons = viewChildren<ElementRef<HTMLButtonElement>>('starButton');

  constructor() {
    effect(() => this.rating.set(this.initialRating()));
    afterNextRender(() => this.setupStarAnimations());
  }

  private setupStarAnimations() {
    this.starButtons().forEach((btnRef) => {
      const btn = btnRef.nativeElement;
      btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.2 }, { duration: 0.2 }));
      btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 }, { duration: 0.2 }));
    });
  }

  protected onStarClick(star: number) {
    this.rating.set(star);
    this.ratingChange.emit(star);
  }

  protected getStarClass(star: number): string {
    const activeRating = this.hover() || this.rating();
    return star <= activeRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300';
  }
}`,
    html: `<div class="bg-white rounded-2xl shadow-lg p-6 w-72">
  <h3 class="font-semibold text-gray-800 mb-4 text-center">評価</h3>
  <div class="flex justify-center gap-1 mb-4">
    @for (star of stars; track star) {
      <button #starButton class="p-1" (click)="onStarClick(star)"
              (mouseenter)="hover.set(star)" (mouseleave)="hover.set(0)">
        <svg class="w-8 h-8 transition-colors" [class]="getStarClass(star)"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    }
  </div>
  <p class="text-center text-gray-600 text-sm">{{ displayRating() }}</p>
</div>`,
    github: `${GITHUB_BASE_URL}/star-rating`,
  },

  chipInput: {
    ts: `import {
  Component, signal, afterNextRender, ElementRef, viewChild, input, output, effect,
} from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.html',
})
export class ChipInput {
  readonly initialChips = input<string[]>(['React', 'TypeScript', 'Tailwind']);
  readonly chipsChange = output<string[]>();
  readonly chipAdded = output<string>();
  readonly chipRemoved = output<string>();

  protected readonly chips = signal<string[]>([]);
  protected readonly inputValue = signal('');
  private readonly chipsContainer = viewChild<ElementRef<HTMLDivElement>>('chipsContainer');

  constructor() {
    effect(() => this.chips.set(this.initialChips()));
  }

  protected onKeyDown(event: KeyboardEvent) {
    const input = this.inputValue().trim();
    if (event.key === 'Enter' && input) {
      event.preventDefault();
      this.addChip(input);
    } else if (event.key === 'Backspace' && !this.inputValue() && this.chips().length > 0) {
      this.removeChip(this.chips().length - 1);
    }
  }

  private addChip(chip: string) {
    this.chips.update((current) => [...current, chip]);
    this.inputValue.set('');
    this.chipAdded.emit(chip);
    this.chipsChange.emit(this.chips());

    setTimeout(() => {
      const container = this.chipsContainer()?.nativeElement;
      const lastChip = container?.querySelector('[data-chip]:last-of-type');
      if (lastChip) animate(lastChip, { scale: [0, 1], opacity: [0, 1] }, { duration: 0.2 });
    }, 0);
  }

  protected removeChip(index: number) {
    const removedChip = this.chips()[index];
    this.chips.update((current) => current.filter((_, i) => i !== index));
    this.chipRemoved.emit(removedChip);
    this.chipsChange.emit(this.chips());
  }
}`,
    html: `<div class="bg-white rounded-2xl shadow-lg p-6 w-80">
  <h3 class="font-semibold text-gray-800 mb-4">タグ入力</h3>
  <div #chipsContainer class="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[100px]">
    @for (chip of chips(); track chip; let i = $index) {
      <span data-chip class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        {{ chip }}
        <button class="hover:bg-blue-200 rounded-full p-0.5" (click)="removeChip(i)">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </span>
    }
    <input type="text" placeholder="タグを追加..." [value]="inputValue()"
           (input)="inputValue.set($any($event.target).value)" (keydown)="onKeyDown($event)"
           class="flex-1 min-w-[100px] outline-none text-sm"/>
  </div>
  <p class="text-xs text-gray-500 mt-2">Enterで追加、Backspaceで削除</p>
</div>`,
    github: `${GITHUB_BASE_URL}/chip-input`,
  },
};
