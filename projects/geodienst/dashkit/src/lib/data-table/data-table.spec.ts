import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { MockInstance } from 'vitest';
import { Column, DataTable } from './data-table';

interface City {
  name: string;
  country: string;
}

const cities: City[] = [
  { name: 'Berlin', country: 'Germany' },
  { name: 'Paris', country: 'France' },
];

const columns: Column<City>[] = [
  { header: 'Name', value: (city) => city.name },
  { header: 'Country', value: (city) => city.country },
];

@Component({
  imports: [DataTable],
  template: `<gd-data-table [items]="items" [columns]="columns" />`,
})
class Host {
  readonly items = cities;
  readonly columns = columns;
}

@Component({
  imports: [DataTable],
  template: `<gd-data-table [items]="items" [columns]="columns" fileNameForDownload="cities.csv" />`,
})
class HostWithDownload {
  readonly items = cities;
  readonly columns = columns;
}

describe('DataTable', () => {
  afterEach(() => {
    clearTranslations();
    vi.restoreAllMocks();
  });

  it('shows the column headers', async () => {
    const fixture = TestBed.createComponent(Host);
    const table = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTableHarness);

    const [headerRow] = await table.getHeaderRows();

    expect(await headerRow.getCellTextByIndex()).toEqual(['Name', 'Country']);
  });

  it('shows one row per item with the value of each column', async () => {
    const fixture = TestBed.createComponent(Host);
    const table = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTableHarness);

    expect(await table.getCellTextByIndex()).toEqual([
      ['Berlin', 'Germany'],
      ['Paris', 'France'],
    ]);
  });

  it('offers no download without a file name for it', async () => {
    const fixture = TestBed.createComponent(Host);

    const buttons = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness);

    expect(buttons).toHaveLength(0);
  });

  describe('download', () => {
    let click: MockInstance<() => void>;

    beforeEach(() => {
      // jsdom has no object URLs and cannot follow the download link, so both are replaced.
      URL.createObjectURL = vi.fn(() => 'blob:test');
      URL.revokeObjectURL = vi.fn();
      click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    });

    // The CSV file handed to the download link.
    const downloadedFile = () => vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;

    it('shows the download as a floating button with the download icon', async () => {
      const fixture = TestBed.createComponent(HostWithDownload);
      const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness);

      expect(await button.getVariant()).toBe('fab');
      expect(await button.getText()).toBe('download');
    });

    it('shows "Download CSV" as tooltip on hover of the download button', async () => {
      const fixture = TestBed.createComponent(HostWithDownload);
      const tooltip = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTooltipHarness);

      await tooltip.show();

      expect(await tooltip.getTooltipText()).toBe('Download CSV');
    });

    it('labels the download button in the loaded language', async () => {
      loadTranslations({ 'dataTable.download': 'CSV herunterladen' });
      // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
      // The host is overridden too: it keeps the table it first compiled with in an earlier test.
      TestBed.overrideComponent(DataTable, { set: {} });
      TestBed.overrideComponent(HostWithDownload, { set: {} });
      const fixture = TestBed.createComponent(HostWithDownload);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('CSV herunterladen');
    });

    it('downloads the items as CSV with the shown columns under the given file name', async () => {
      const fixture = TestBed.createComponent(HostWithDownload);
      const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness);

      await button.click();

      expect(await downloadedFile().text()).toBe('"Name","Country"\r\n"Berlin","Germany"\r\n"Paris","France"');
      expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('cities.csv');
    });

    it('starts the file with a byte order mark, so Excel reads special characters correctly', async () => {
      const fixture = TestBed.createComponent(HostWithDownload);
      const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness);

      await button.click();

      const firstBytes = new Uint8Array(await downloadedFile().arrayBuffer()).slice(0, 3);
      expect([...firstBytes]).toEqual([0xef, 0xbb, 0xbf]);
    });
  });
});
