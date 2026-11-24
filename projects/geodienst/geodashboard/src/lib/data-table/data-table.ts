import { Component, computed, input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { toCsv } from './csv';

// One column of the table: its header and how to get the cell text from an item.
export interface Column<T> {
  header: string;
  value: (item: T) => string;
}

@Component({
  imports: [MatFabButton, MatIcon, MatTableModule, MatTooltip],
  selector: 'gd-data-table',
  styleUrl: './data-table.css',
  templateUrl: './data-table.html',
})
export class DataTable<T> {
  readonly items = input.required<T[]>();
  readonly columns = input.required<Column<T>[]>();
  // Without a file name there is no download button.
  readonly fileNameForDownload = input<string>();
  // mat-table needs an id per column; the position is enough.
  protected readonly columnIds = computed(() => this.columns().map((_, index) => String(index)));

  // Downloads the items with the shown columns as CSV; the byte order mark makes Excel read it as UTF-8.
  protected download(fileName: string) {
    const csv = toCsv(this.items(), this.columns());
    const file = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
