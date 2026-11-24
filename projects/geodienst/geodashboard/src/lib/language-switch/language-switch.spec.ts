import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { LanguageSwitch } from './language-switch';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'bg', name: 'Български' },
  { code: 'el', name: 'Ελληνικά' },
];

describe('LanguageSwitch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'de' }] });
  });

  function createSwitch() {
    const fixture = TestBed.createComponent(LanguageSwitch);
    fixture.componentRef.setInput('languages', languages);
    return fixture;
  }

  it('shows the current language', async () => {
    const fixture = createSwitch();
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);

    expect(await menu.getTriggerText()).toBe('Deutsch');
  });

  it('offers every language by its own name', async () => {
    const fixture = createSwitch();
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);

    await menu.open();
    const items = await menu.getItems();
    const texts = await Promise.all(items.map((item) => item.getText()));

    expect(texts).toEqual(['English', 'Deutsch', 'Français', 'Español', 'Türkçe', 'Български', 'Ελληνικά']);
  });

  it('links each language to the URL with its locale', async () => {
    const fixture = createSwitch();
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);

    await menu.open();
    const items = await menu.getItems();
    const hrefs = await Promise.all(items.map(async (item) => (await item.host()).getAttribute('href')));

    expect(hrefs).toEqual([
      '?locale=en',
      '?locale=de',
      '?locale=fr',
      '?locale=es',
      '?locale=tr',
      '?locale=bg',
      '?locale=el',
    ]);
  });

  it('can be shown as an item of a surrounding menu, which stays open when the languages open', async () => {
    const fixture = createSwitch();
    fixture.componentRef.setInput('menuItem', true);
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);
    const item = fixture.nativeElement.querySelector('button[mat-menu-item]');
    const surroundingMenuClick = vi.fn();
    fixture.nativeElement.addEventListener('click', surroundingMenuClick);

    expect(item?.textContent).toContain('Deutsch');

    item.click();

    expect(surroundingMenuClick).not.toHaveBeenCalled();
    expect(await menu.isOpen()).toBe(true);
  });
});
