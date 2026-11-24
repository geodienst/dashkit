import { Component, input, model } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

@Component({
  imports: [MatFormField, MatLabel, MatSelect, MatOption, MatCheckbox],
  selector: 'gd-multi-select-filter',
  styleUrl: './multi-select-filter.css',
  templateUrl: './multi-select-filter.html',
})
export class MultiSelectFilter {
  readonly label = input.required<string>();
  readonly options = input.required<string[]>();
  readonly optionLabels = input<Record<string, string>>({});
  readonly selected = model<string[]>([]);
  readonly selectAll = input(false);
}
