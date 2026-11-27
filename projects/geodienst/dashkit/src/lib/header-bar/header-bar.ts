import { Component, input } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  imports: [MatToolbar],
  selector: 'gd-header-bar',
  styleUrl: './header-bar.css',
  templateUrl: './header-bar.html',
})
export class HeaderBar {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly logo = input<string>();
  readonly logoLink = input<string>();
}
