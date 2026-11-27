import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { Legend } from './legend';

@Component({
  imports: [Legend],
  template: `
    <gd-legend
      [items]="['groups', 'child_care', 'groups']"
      [iconOf]="iconOf"
      [labels]="{ child_care: 'Children', groups: 'Groups', unused: 'Unused' }"
    />
  `,
})
class Host {
  readonly iconOf = (icon: string) => icon;
}

@Component({
  imports: [Legend],
  template: `<gd-legend [items]="['groups', 'cognition_2']" [iconOf]="iconOf" [labels]="{ groups: 'Groups' }" />`,
})
class HostWithOthers {
  readonly iconOf = (icon: string) => icon;
}

@Component({
  imports: [Legend],
  template: `
    <gd-legend
      [items]="['groups', 'cognition_2']"
      [iconOf]="iconOf"
      [labels]="{ groups: 'Groups' }"
      [showOtherNames]="true"
    />
  `,
})
class HostWithOtherNames {
  readonly iconOf = (icon: string) => icon;
}

@Component({
  imports: [Legend],
  template: `
    <gd-legend
      [items]="['groups', 'child_care']"
      [shownItems]="['groups']"
      [iconOf]="iconOf"
      [labels]="{ child_care: 'Children', groups: 'Groups' }"
    />
  `,
})
class HostWithShownItems {
  readonly iconOf = (icon: string) => icon;
}

@Component({
  imports: [Legend],
  template: `
    <gd-legend
      [items]="['groups', 'child_care']"
      [shownItems]="['groups']"
      [iconOf]="iconOf"
      [labels]="{ child_care: 'Children', groups: 'Groups' }"
      [showOnlyVisibleIcons]="true"
    />
  `,
})
class HostShowingOnlyVisibleIcons {
  readonly iconOf = (icon: string) => icon;
}

describe('Legend', () => {
  afterEach(() => {
    clearTranslations();
    vi.unstubAllGlobals();
  });

  it('shows each used icon with a label once, in the order of the labels', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const labels = [...fixture.nativeElement.querySelectorAll('.label')];
    expect(labels.map((label) => label.textContent.trim())).toEqual(['Children', 'Groups']);
  });

  it('shows icons without a label after a divider in the other group, without their name', async () => {
    const fixture = TestBed.createComponent(HostWithOthers);
    await fixture.whenStable();

    const element = fixture.nativeElement;
    expect(element.querySelectorAll('.other gd-marker-icon').length).toBe(1);
    expect(element.querySelector('mat-divider')).toBeTruthy();
    expect(element.querySelector('.other .label')).toBeNull();
  });

  it('shows the name of an other icon as tooltip on hover', async () => {
    const fixture = TestBed.createComponent(HostWithOthers);
    await fixture.whenStable();

    const tooltip = fixture.debugElement.query(By.directive(MatTooltip))?.injector.get(MatTooltip);
    expect(tooltip?.message).toBe('cognition_2');
  });

  it('shows the names of the other icons if wanted', async () => {
    const fixture = TestBed.createComponent(HostWithOtherNames);
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.other .label');
    expect(label?.textContent.trim()).toBe('cognition_2');
  });

  it('shows the icons of all items by default, also of the filtered ones', async () => {
    const fixture = TestBed.createComponent(HostWithShownItems);
    await fixture.whenStable();

    const labels = [...fixture.nativeElement.querySelectorAll('.label')];
    expect(labels.map((label) => label.textContent.trim())).toEqual(['Children', 'Groups']);
  });

  it('shows only the icons of the shown items if only visible icons are wanted', async () => {
    const fixture = TestBed.createComponent(HostShowingOnlyVisibleIcons);
    await fixture.whenStable();

    const labels = [...fixture.nativeElement.querySelectorAll('.label')];
    expect(labels.map((label) => label.textContent.trim())).toEqual(['Groups']);
  });

  it('collapses to the legend icon and the title on click', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('gd-legend').click();
    await fixture.whenStable();

    const element = fixture.nativeElement;
    expect(element.querySelectorAll('.label').length).toBe(0);
    expect(element.querySelector('.title mat-icon')?.textContent.trim()).toBe('legend_toggle');
    expect(element.querySelector('.title')?.textContent).toContain('Legend');
  });

  it('expands again on a second click', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const legend = fixture.nativeElement.querySelector('gd-legend');

    legend.click();
    await fixture.whenStable();
    legend.click();
    await fixture.whenStable();

    const element = fixture.nativeElement;
    expect(element.querySelectorAll('.label').length).toBe(2);
    expect(element.querySelector('.title mat-icon')).toBeNull();
  });

  it('starts collapsed on a small screen', async () => {
    // jsdom has no matchMedia; this stand-in matches every media query, like a smartphone screen would match the small ones.
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query, addListener() {}, removeListener() {} }));
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const element = fixture.nativeElement;
    expect(element.querySelectorAll('.label').length).toBe(0);
    expect(element.querySelector('.title mat-icon')?.textContent.trim()).toBe('legend_toggle');
  });

  it('shows no divider if every icon has a label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-divider')).toBeNull();
  });

  it('shows the other group heading in the loaded language', async () => {
    loadTranslations({ 'legend.other': 'Sonstige' });
    // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
    // The host is overridden too: it keeps the legend it first compiled with in an earlier test.
    TestBed.overrideComponent(Legend, { set: {} });
    TestBed.overrideComponent(HostWithOthers, { set: {} });
    const fixture = TestBed.createComponent(HostWithOthers);
    await fixture.whenStable();

    const heading = fixture.nativeElement.querySelector('.other .heading');
    expect(heading?.textContent.trim()).toBe('Sonstige');
  });

  it('shows the title on top in the loaded language', async () => {
    loadTranslations({ 'legend.title': 'Legende' });
    TestBed.overrideComponent(Legend, { set: {} });
    TestBed.overrideComponent(Host, { set: {} });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const first = fixture.nativeElement.querySelector('gd-legend').firstElementChild;
    expect(first?.classList).toContain('title');
    expect(first?.textContent.trim()).toBe('Legende');
  });
});
