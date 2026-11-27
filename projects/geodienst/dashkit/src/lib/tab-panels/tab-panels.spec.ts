import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabNavBarHarness } from '@angular/material/tabs/testing';
import { TabPanel, TabPanels } from './tab-panels';

@Component({
  imports: [TabPanels, TabPanel],
  template: `
    <gd-tab-panels>
      <div gdTabPanel="First" class="first">1</div>
      <div gdTabPanel="Second" class="second">2</div>
    </gd-tab-panels>
  `,
})
class Host {}

describe('TabPanels', () => {
  it('shows one tab per panel, labelled with the panel label', async () => {
    const fixture = TestBed.createComponent(Host);
    const nav = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabNavBarHarness);

    const links = await nav.getLinks();
    const labels = await Promise.all(links.map((link) => link.getLabel()));

    expect(labels).toEqual(['First', 'Second']);
  });

  it('shows the first panel by default and hides the others', async () => {
    const fixture = TestBed.createComponent(Host);
    const nav = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabNavBarHarness);

    expect(await (await nav.getActiveLink()).getLabel()).toBe('First');
    expect(fixture.nativeElement.querySelector('.first').hidden).toBe(false);
    expect(fixture.nativeElement.querySelector('.second').hidden).toBe(true);
  });

  it('shows the panel of the clicked tab and hides the others', async () => {
    const fixture = TestBed.createComponent(Host);
    const nav = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabNavBarHarness);

    await nav.clickLink({ label: 'Second' });

    expect(await (await nav.getActiveLink()).getLabel()).toBe('Second');
    expect(fixture.nativeElement.querySelector('.first').hidden).toBe(true);
    expect(fixture.nativeElement.querySelector('.second').hidden).toBe(false);
  });
});
