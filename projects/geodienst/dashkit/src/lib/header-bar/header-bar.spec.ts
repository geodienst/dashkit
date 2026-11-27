import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HeaderBar } from './header-bar';

@Component({
  imports: [HeaderBar],
  template: `
    <gd-header-bar [title]="'My Title'" [subtitle]="'My Subtitle'" [logo]="'my-logo.svg'" [logoLink]="'https://example.com/'">
      <button>Extra</button>
    </gd-header-bar>
  `,
})
class Host {}

@Component({
  imports: [HeaderBar],
  template: `<gd-header-bar [title]="'My Title'" [logoLink]="'https://example.com/'" />`,
})
class LinkWithoutLogoHost {}

@Component({
  imports: [HeaderBar],
  template: `<gd-header-bar [title]="'My Title'" [logo]="'my-logo.svg'" />`,
})
class LogoWithoutLinkHost {}

@Component({
  imports: [HeaderBar],
  template: `
    <gd-header-bar [title]="'My Title'" [logo]="'my-logo.svg'">
      <button>Extra</button>
      <button headerStart>Start</button>
    </gd-header-bar>
  `,
})
class HostWithStartContent {}

describe('HeaderBar', () => {
  it('shows content marked headerStart in front of the logo', async () => {
    const fixture = TestBed.createComponent(HostWithStartContent);
    await fixture.whenStable();

    const first = fixture.nativeElement.querySelector('mat-toolbar > :first-child');
    expect(first?.textContent).toBe('Start');
  });

  it('shows the title and subtitle', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('My Title');
    expect(text).toContain('My Subtitle');
  });

  it('shows the logo in front of the title as a link opening in a new tab', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const first = fixture.nativeElement.querySelector('mat-toolbar > :first-child');
    expect(first?.tagName).toBe('A');
    expect(first?.getAttribute('href')).toBe('https://example.com/');
    expect(first?.getAttribute('target')).toBe('_blank');
    expect(first?.querySelector('img')?.getAttribute('src')).toBe('my-logo.svg');
  });

  it('shows neither logo nor link without a logo', async () => {
    const fixture = TestBed.createComponent(LinkWithoutLogoHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-toolbar a')).toBeNull();
    expect(fixture.nativeElement.querySelector('mat-toolbar img')).toBeNull();
  });

  it('shows the logo as a plain image without a link', async () => {
    const fixture = TestBed.createComponent(LogoWithoutLinkHost);
    await fixture.whenStable();

    const first = fixture.nativeElement.querySelector('mat-toolbar > :first-child');
    expect(first?.tagName).toBe('IMG');
    expect(first?.getAttribute('src')).toBe('my-logo.svg');
  });

  it('shows projected content', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('gd-header-bar button')).not.toBeNull();
  });
});

