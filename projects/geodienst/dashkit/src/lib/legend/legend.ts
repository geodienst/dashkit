import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MarkerIcon } from '../marker-icon/marker-icon';

// Explains the icons on a map: one line per icon with its label. A click collapses it to its title and back.
// On a smartphone-sized screen (below 600px) it starts collapsed.
@Component({
  host: { '(click)': 'collapsed.set(!collapsed())' },
  imports: [MarkerIcon, MatDivider, MatIcon, MatTooltip],
  selector: 'gd-legend',
  styleUrl: './legend.css',
  templateUrl: './legend.html',
})
export class Legend<T> {
  readonly items = input.required<T[]>();
  // The items that pass the current filters; only used with showOnlyVisibleIcons.
  readonly shownItems = input<T[]>([]);
  // true: only icons of the shown items; false: icons of all items, so the legend stays the same while filtering.
  readonly showOnlyVisibleIcons = input(false);
  readonly iconOf = input.required<(item: T) => string>();
  // Icon name → label; the order of the keys is the order in the legend.
  readonly labels = input<Record<string, string>>({});
  // Icons without a label are shown under "Other" with their icon name as tooltip; true also shows the name next to them.
  readonly showOtherNames = input(false);
  protected readonly collapsed = signal(inject(BreakpointObserver).isMatched(Breakpoints.XSmall));
  private readonly used = computed(
    () => new Set((this.showOnlyVisibleIcons() ? this.shownItems() : this.items()).map(this.iconOf())),
  );
  protected readonly labelled = computed(() => Object.keys(this.labels()).filter((icon) => this.used().has(icon)));
  protected readonly others = computed(() => [...this.used()].filter((icon) => !(icon in this.labels())));
}
