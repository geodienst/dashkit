import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  imports: [MatButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger],
  selector: 'gd-language-switch',
  styleUrl: './language-switch.css',
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  readonly languages = input.required<{ code: string; name: string }[]>();
  readonly menuItem = input(false);
  private readonly locale = inject(LOCALE_ID);
  protected readonly current = computed(() => this.languages().find((language) => language.code === this.locale)!);
}
