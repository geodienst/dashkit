import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { InfoButton } from './info-button';

describe('InfoButton', () => {
  afterEach(() => clearTranslations());

  it('shows the button label in the loaded language', async () => {
    loadTranslations({ 'infoButton.help': 'Hilfe' });
    // Angular translates template texts once per component; overriding forces a fresh compile with these translations.
    TestBed.overrideComponent(InfoButton, { set: {} });
    const fixture = TestBed.createComponent(InfoButton);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Hilfe');
  });

  it('shows a button with the help icon', async () => {
    const fixture = TestBed.createComponent(InfoButton);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button mat-icon')?.textContent.trim()).toBe('help_outline');
  });

  it('shows "Help" as tooltip on hover', async () => {
    const fixture = TestBed.createComponent(InfoButton);
    const tooltip = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTooltipHarness);

    await tooltip.show();

    expect(await tooltip.getTooltipText()).toBe('Help');
  });
});
