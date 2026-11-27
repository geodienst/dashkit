import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { CountryFilter } from './country-filter';

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter [counts]="{ Germany: 3, Greece: 5 }" [(selected)]="selected" />`,
})
class Host {
  readonly selected = signal<string[]>([]);
}

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter [counts]="{ Greece: 5, Austria: 1, Germany: 3 }" />`,
})
class HostWithUnsortedCounts {}

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter [counts]="{ Germany: 3, Greece: 5 }" [hideCount]="true" />`,
})
class HostWithoutCount {}

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter [counts]="{ Austria: 1, Greece: 5, Germany: 3 }" sortBy="count" />`,
})
class HostSortedByCount {}

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter [counts]="{ Germany: 3, Greece: 5 }" title="Countries" subtitle="Pick some" />`,
})
class HostWithTitle {}

@Component({
  imports: [CountryFilter],
  template: `<gd-country-filter
    [counts]="{ Germany: 3, Greece: 5 }"
    [(selected)]="selected"
    [buttonCountries]="['Greece']"
    buttonIcon="map"
    buttonLabel="Maps"
    (buttonClick)="clicked = $event"
  />`,
})
class HostWithButton {
  readonly selected = signal<string[]>([]);
  clicked?: string;
}

describe('CountryFilter', () => {
  it('shows a toggle per country with its count', async () => {
    const fixture = TestBed.createComponent(Host);
    const toggles = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonToggleHarness);
    const texts = await Promise.all(toggles.map((toggle) => toggle.getText()));

    expect(texts).toEqual(['Germany (3)', 'Greece (5)']);
  });

  it('selects a country on click and deselects it on the next click', async () => {
    const fixture = TestBed.createComponent(Host);
    const toggles = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonToggleHarness);
    const greece = toggles[1];

    await greece?.toggle();
    expect(fixture.componentInstance.selected()).toEqual(['Greece']);

    await greece?.toggle();
    expect(fixture.componentInstance.selected()).toEqual([]);
  });

  it('sorts the toggles alphabetically', async () => {
    const fixture = TestBed.createComponent(HostWithUnsortedCounts);
    const toggles = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonToggleHarness);
    const texts = await Promise.all(toggles.map((toggle) => toggle.getText()));

    expect(texts).toEqual(['Austria (1)', 'Germany (3)', 'Greece (5)']);
  });

  it('sorts the toggles by count, largest first, when sortBy is count', async () => {
    const fixture = TestBed.createComponent(HostSortedByCount);
    const toggles = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonToggleHarness);
    const texts = await Promise.all(toggles.map((toggle) => toggle.getText()));

    expect(texts).toEqual(['Greece (5)', 'Germany (3)', 'Austria (1)']);
  });

  it('shows a bar per country relative to the largest count', async () => {
    const fixture = TestBed.createComponent(Host);
    const bars = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatProgressBarHarness);
    const values = await Promise.all(bars.map((bar) => bar.getValue()));

    expect(values).toEqual([60, 100]);
  });

  it('hides the count when hideCount is true', async () => {
    const fixture = TestBed.createComponent(HostWithoutCount);
    const toggles = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonToggleHarness);
    const texts = await Promise.all(toggles.map((toggle) => toggle.getText()));

    expect(texts).toEqual(['Germany', 'Greece']);
  });

  it('shows the title above the toggles', async () => {
    const fixture = TestBed.createComponent(HostWithTitle);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2')?.textContent.trim()).toBe('Countries');
  });

  it('shows the subtitle below the title', async () => {
    const fixture = TestBed.createComponent(HostWithTitle);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2 + p')?.textContent.trim()).toBe('Pick some');
  });

  it('shows a button only for the given countries and emits the country on click without toggling it', async () => {
    const fixture = TestBed.createComponent(HostWithButton);
    const buttons = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness);

    expect(buttons.length).toBe(1);
    expect(await (await buttons[0].host()).getAttribute('aria-label')).toBe('Maps');

    await buttons[0].click();

    expect(fixture.componentInstance.clicked).toBe('Greece');
    expect(fixture.componentInstance.selected()).toEqual([]);
  });
});
