import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatActionListItemHarness } from '@angular/material/list/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { ItemList } from './item-list';

@Component({
  imports: [ItemList],
  template: `<gd-item-list [items]="items" [displayWith]="displayWith" />`,
})
class Host {
  readonly items = [{ name: 'A' }, { name: 'B' }];
  readonly displayWith = (item: { name: string }) => item.name;
}

@Component({
  imports: [ItemList],
  template: `<gd-item-list [items]="items" [displayWith]="displayWith" sortBy="alphabetically" />`,
})
class HostSortedAlphabetically {
  readonly items = [{ name: 'C' }, { name: 'A' }, { name: 'B' }];
  readonly displayWith = (item: { name: string }) => item.name;
}

@Component({
  imports: [ItemList],
  template: `
    <gd-item-list [items]="items" [displayWith]="displayWith" sortBy="alphabetically">
      <ng-template let-item><span class="icon">{{ item.name }}</span></ng-template>
    </gd-item-list>
  `,
})
class HostWithIcon {
  readonly items = [{ name: 'C' }, { name: 'A' }, { name: 'B' }];
  readonly displayWith = (item: { name: string }) => item.name;
}

@Component({
  imports: [ItemList],
  template: `<gd-item-list [items]="items" [displayWith]="displayWith" />`,
})
class HostForSearch {
  readonly items = [{ name: 'Mental Care' }, { name: 'CareNet' }, { name: 'Other' }];
  readonly displayWith = (item: { name: string }) => item.name;
}

@Component({
  imports: [ItemList],
  template: `<gd-item-list [items]="items" [displayWith]="displayWith" (itemClick)="clicked = $event" />`,
})
class HostForClick {
  readonly items = [{ name: 'A' }, { name: 'B' }];
  readonly displayWith = (item: { name: string }) => item.name;
  clicked?: unknown;
}

describe('ItemList', () => {
  afterEach(() => clearTranslations());

  it('shows the search label in the loaded language', async () => {
    loadTranslations({ 'itemList.search': 'Suchen' });
    // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
    TestBed.overrideComponent(ItemList, { set: {} });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('mat-label');
    expect(label.textContent.trim()).toBe('Suchen');
  });

  it('shows one line per item, as given by displayWith', async () => {
    const fixture = TestBed.createComponent(Host);
    const items = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatActionListItemHarness);
    const texts = await Promise.all(items.map((item) => item.getFullText()));

    expect(texts).toEqual(['A', 'B']);
  });

  it('sorts the lines alphabetically when sortBy is alphabetically', async () => {
    const fixture = TestBed.createComponent(HostSortedAlphabetically);
    const items = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatActionListItemHarness);
    const texts = await Promise.all(items.map((item) => item.getFullText()));

    expect(texts).toEqual(['A', 'B', 'C']);
  });

  it('shows the whole text of a line as tooltip on hover', async () => {
    const fixture = TestBed.createComponent(Host);
    const tooltips = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatTooltipHarness);
    const texts = [];
    // The harness reads the first tooltip in the document, so each one is hidden again before the next is shown.
    for (const tooltip of tooltips) {
      await tooltip.show();
      texts.push(await tooltip.getTooltipText());
      await tooltip.hide();
    }

    expect(texts).toEqual(['A', 'B']);
  });

  it('shows the given icon template in front of each line, with its item', async () => {
    const fixture = TestBed.createComponent(HostWithIcon);
    await fixture.whenStable();

    // The items are sorted, so each icon must have moved along with its line.
    const icons = fixture.nativeElement.querySelectorAll('.mat-mdc-list-item .icon');
    expect([...icons].map((icon: Element) => icon.textContent)).toEqual(['A', 'B', 'C']);
  });

  it('shows only the lines containing the search text', async () => {
    const fixture = TestBed.createComponent(HostForSearch);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await (await loader.getHarness(MatInputHarness)).setValue('Care');
    const items = await loader.getAllHarnesses(MatActionListItemHarness);
    const texts = await Promise.all(items.map((item) => item.getFullText()));

    expect(texts).toEqual(['Mental Care', 'CareNet']);
  });

  it('ignores case when searching', async () => {
    const fixture = TestBed.createComponent(HostForSearch);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await (await loader.getHarness(MatInputHarness)).setValue('care');
    const items = await loader.getAllHarnesses(MatActionListItemHarness);
    const texts = await Promise.all(items.map((item) => item.getFullText()));

    expect(texts).toEqual(['Mental Care', 'CareNet']);
  });

  it('emits the clicked item', async () => {
    const fixture = TestBed.createComponent(HostForClick);
    await fixture.whenStable();

    fixture.nativeElement.querySelectorAll('.mat-mdc-list-item')[1].click();

    expect(fixture.componentInstance.clicked).toEqual({ name: 'B' });
  });
});
