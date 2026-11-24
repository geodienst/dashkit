import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

// The icon of a location, the same on the map and in lists.
@Component({
  imports: [MatIcon],
  selector: 'gd-marker-icon',
  styleUrl: './marker-icon.css',
  templateUrl: './marker-icon.html',
})
export class MarkerIcon {
  // A Material Symbols name, see https://fonts.google.com/icons.
  readonly icon = input('');
}
