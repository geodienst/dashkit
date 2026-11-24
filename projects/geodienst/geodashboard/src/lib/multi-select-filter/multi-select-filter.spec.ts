import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { MultiSelectFilter } from './multi-select-filter';

@Component({
  imports: [MultiSelectFilter],
  template: `
    <gd-multi-select-filter
      [label]="'Target group'"
      [options]="['children/ minors', 'refugees']"
      [(selected)]="selected"
      [selectAll]="true"
    />
  `,
})
class Host {
  readonly selected = signal<string[]>([]);
}

@Component({
  imports: [MultiSelectFilter],
  template: `
    <gd-multi-select-filter [label]="'Target group'" [options]="['children/ minors', 'refugees']" />
  `,
})
class HostWithoutSelectAll {}

@Component({
  imports: [MultiSelectFilter],
  template: `
    <gd-multi-select-filter
      [label]="'Target group'"
      [options]="['children/ minors', 'refugees']"
      [optionLabels]="{ refugees: 'Flüchtlinge' }"
    />
  `,
})
class HostWithOptionLabels {}

describe('MultiSelectFilter', () => {
  afterEach(() => {
    clearTranslations();
    vi.restoreAllMocks();
  });

  it('shows "Select all" in the loaded language', async () => {
    loadTranslations({ 'multiSelectFilter.selectAll': 'Alle auswählen' });
    // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
    // The host is overridden too: it keeps the filter it first compiled with, which would leak the German text into later tests.
    TestBed.overrideComponent(MultiSelectFilter, { set: {} });
    TestBed.overrideComponent(Host, { set: {} });
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const selectAll = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(MatCheckboxHarness);

    expect(await selectAll.getLabelText()).toBe('Alle auswählen');
  });

  it('shows the label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Target group');
  });

  it('offers every given option', async () => {
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const options = await select.getOptions();
    const texts = await Promise.all(options.map((option) => option.getText()));

    expect(texts).toEqual(['children/ minors', 'refugees']);
  });

  it('updates the selection when options are picked', async () => {
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.clickOptions({ text: 'refugees' });

    expect(fixture.componentInstance.selected()).toEqual(['refugees']);
  });

  it('selects every option via "Select all"', async () => {
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const selectAll = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(
      MatCheckboxHarness.with({ label: 'Select all' }),
    );
    await selectAll.check();

    expect(fixture.componentInstance.selected()).toEqual(['children/ minors', 'refugees']);
  });

  it('deselects every option when "Select all" is unchecked', async () => {
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const selectAll = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(
      MatCheckboxHarness.with({ label: 'Select all' }),
    );
    await selectAll.check();
    await selectAll.uncheck();

    expect(fixture.componentInstance.selected()).toEqual([]);
  });

  it('shows "Select all" as checked when every option is picked', async () => {
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.clickOptions({ text: 'children/ minors' });
    await select.clickOptions({ text: 'refugees' });
    const selectAll = await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(
      MatCheckboxHarness.with({ label: 'Select all' }),
    );

    expect(await selectAll.isChecked()).toBe(true);
  });

  it('offers no "Select all" by default', async () => {
    const fixture = TestBed.createComponent(HostWithoutSelectAll);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const checkboxes = await TestbedHarnessEnvironment.documentRootLoader(fixture).getAllHarnesses(
      MatCheckboxHarness,
    );

    expect(checkboxes.length).toBe(0);
  });

  it('sizes the open list to its options, not to the field, so it stays readable when the field is squeezed', async () => {
    // jsdom measures every element as 0px wide, which the overlay ignores; give the field a width it could copy.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect);
    const fixture = TestBed.createComponent(Host);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();

    // A list as wide as the field gets the field's width on the overlay pane; a list sized to its options gets none.
    const pane = document.querySelector<HTMLElement>('.cdk-overlay-pane');
    expect(pane?.style.width).toBe('');
  });

  it('shows the option label instead of the value, falling back to the value', async () => {
    const fixture = TestBed.createComponent(HostWithOptionLabels);
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);

    await select.open();
    const options = await select.getOptions();
    const texts = await Promise.all(options.map((option) => option.getText()));

    expect(texts).toEqual(['children/ minors', 'Flüchtlinge']);
  });
});
