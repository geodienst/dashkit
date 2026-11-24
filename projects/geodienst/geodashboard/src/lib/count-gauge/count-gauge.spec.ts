import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { CountGauge } from './count-gauge';

@Component({
  imports: [CountGauge],
  template: `<gd-count-gauge [count]="21" [total]="42" />`,
})
class Host {}

describe('CountGauge', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows the count and the total', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('21');
    expect(text).toContain('of 42');
  });

  it('fills the ring by count relative to total', async () => {
    const fixture = TestBed.createComponent(Host);
    const spinner = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatProgressSpinnerHarness);

    expect(await spinner.getValue()).toBe(50);
  });

  it('shows only a small ring with the count on a small screen', async () => {
    // jsdom has no matchMedia; this stand-in matches every media query, like a smartphone screen would match the small ones.
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query, addListener() {}, removeListener() {} }));
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('21');
    expect(text).not.toContain('of 42');
    expect(fixture.nativeElement.querySelector('mat-progress-spinner').style.width).toBe('36px');
  });
});
