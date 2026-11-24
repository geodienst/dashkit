import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { map } from 'rxjs';

// On a smartphone-sized screen (below 600px) it shrinks to a small ring with only the count.
@Component({
  host: { '[class.small]': 'small()' },
  imports: [MatProgressSpinner],
  selector: 'gd-count-gauge',
  styleUrl: './count-gauge.css',
  templateUrl: './count-gauge.html',
})
export class CountGauge {
  readonly count = input.required<number>();
  readonly total = input.required<number>();
  protected readonly value = computed(() => (this.total() ? (this.count() / this.total()) * 100 : 0));
  protected readonly small = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.XSmall)
      .pipe(map((state) => state.matches)),
  );
}
