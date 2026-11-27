import { Component, computed, input, model, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonToggleGroup, MatButtonToggle, MatIcon, MatIconButton, MatProgressBar, MatTooltip],
  selector: 'gd-country-filter',
  styleUrl: './country-filter.css',
  templateUrl: './country-filter.html',
})
export class CountryFilter {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  // Count per country; one toggle per key.
  readonly counts = input<Record<string, number>>({});
  readonly selected = model<string[]>([]);
  readonly hideCount = input(false);
  readonly sortBy = input<'alphabetically' | 'count'>('alphabetically');
  // Countries that get a button next to their toggle; a click emits the country.
  readonly buttonCountries = input<string[]>([]);
  readonly buttonIcon = input<string>();
  readonly buttonLabel = input<string>();
  readonly buttonClick = output<string>();
  protected readonly countries = computed(() => {
    const countries = Object.keys(this.counts()).sort();
    return this.sortBy() === 'count' ? countries.sort((a, b) => this.counts()[b] - this.counts()[a]) : countries;
  });
  protected readonly max = computed(() => Math.max(...Object.values(this.counts())));
}
