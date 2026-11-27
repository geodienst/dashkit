import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [MatIcon, MatIconButton, MatTooltip],
  selector: 'gd-info-button',
  templateUrl: './info-button.html',
})
export class InfoButton {}
