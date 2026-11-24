import { Component, input } from '@angular/core';

@Component({
  selector: 'gd-image',
  styleUrl: './image.css',
  templateUrl: './image.html',
})
export class Image {
  readonly src = input.required<string>();
}
