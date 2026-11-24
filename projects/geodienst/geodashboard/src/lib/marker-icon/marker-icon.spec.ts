import { TestBed } from '@angular/core/testing';
import { MarkerIcon } from './marker-icon';

describe('MarkerIcon', () => {
  it('shows the given icon', async () => {
    const fixture = TestBed.createComponent(MarkerIcon);
    fixture.componentRef.setInput('icon', 'child_care');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-icon')?.textContent.trim()).toBe('child_care');
  });
});
