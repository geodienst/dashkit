import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Image } from './image';

@Component({
  imports: [Image],
  template: `<gd-image src="some/picture.png" />`,
})
class Host {}

describe('Image', () => {
  it('shows the referenced picture', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe('some/picture.png');
  });
});
