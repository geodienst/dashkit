import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, input, output, signal, TemplateRef } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatFormField, MatInput, MatLabel, MatListModule, MatTooltipModule, NgTemplateOutlet],
  selector: 'gd-item-list',
  styleUrl: './item-list.css',
  templateUrl: './item-list.html',
})
export class ItemList<T> {
  readonly items = input.required<T[]>();
  // Turns one item into the text of its line.
  readonly displayWith = input.required<(item: T) => string>();
  readonly sortBy = input<'none' | 'alphabetically'>('none');
  readonly itemClick = output<T>();
  // Optional icon in front of each line; gets its item as `let-item`.
  protected readonly icon = contentChild(TemplateRef);
  protected readonly search = signal('');
  protected readonly rows = computed(() => {
    const rows = toRows(this.items(), this.displayWith());
    const searchedRows = searchRows(rows, this.search());
    return sortRows(searchedRows, this.sortBy());
  });
}

interface Row<T> {
  item: T;
  text: string;
}

// Pairs each item with its text, so displayWith runs only once per item.
function toRows<T>(items: T[], displayWith: (item: T) => string): Row<T>[] {
  return items.map((item) => ({ item, text: displayWith(item) }));
}

// Keeps the rows whose text contains the search text, ignoring case.
function searchRows<T>(rows: Row<T>[], search: string): Row<T>[] {
  return rows.filter((row) => row.text.toLowerCase().includes(search.toLowerCase()));
}

function sortRows<T>(rows: Row<T>[], sortBy: 'none' | 'alphabetically'): Row<T>[] {
  return sortBy === 'alphabetically' ? rows.sort((a, b) => a.text.localeCompare(b.text)) : rows;
}
