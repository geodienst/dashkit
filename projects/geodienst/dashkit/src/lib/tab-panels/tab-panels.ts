import { Component, computed, contentChildren, Directive, inject, input, linkedSignal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

// Marks a projected element as one panel of <gd-tab-panels>; the attribute value is its tab label.
// Inactive panels are only hidden, not destroyed, so their state (e.g. a map) is kept.
@Directive({ selector: '[gdTabPanel]', host: { '[hidden]': '!active()' } })
export class TabPanel {
  readonly label = input.required<string>({ alias: 'gdTabPanel' });
  private readonly tabPanels = inject(TabPanels);
  protected readonly active = computed(() => this.tabPanels.active() === this);
}

@Component({
  imports: [MatTabsModule],
  selector: 'gd-tab-panels',
  styleUrl: './tab-panels.css',
  templateUrl: './tab-panels.html',
})
export class TabPanels {
  protected readonly panels = contentChildren(TabPanel);
  // The first panel until a tab is clicked.
  readonly active = linkedSignal(() => this.panels()[0]);
}
