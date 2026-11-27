import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuItem } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { Menu } from './menu';

@Component({
  imports: [Menu, MatMenuItem],
  template: `
    <gd-menu>
      <button mat-menu-item>Item</button>
    </gd-menu>
  `,
})
class Host {}

describe('Menu', () => {
  afterEach(() => clearTranslations());

  it('shows the button label in the loaded language', async () => {
    loadTranslations({ 'menu.menu': 'Menü' });
    // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
    TestBed.overrideComponent(Menu, { set: {} });
    const fixture = TestBed.createComponent(Menu);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Menü');
  });

  it('shows a button with three vertical dots', async () => {
    const fixture = TestBed.createComponent(Menu);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button mat-icon')?.textContent.trim()).toBe('more_vert');
  });

  it('shows projected content in the menu', async () => {
    const fixture = TestBed.createComponent(Host);
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);

    await menu.open();
    const items = await menu.getItems();
    const texts = await Promise.all(items.map((item) => item.getText()));

    expect(texts).toEqual(['Item']);
  });
});
