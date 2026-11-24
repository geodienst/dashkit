import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuTrigger],
  selector: 'gd-menu',
  templateUrl: './menu.html',
})
export class Menu {}
