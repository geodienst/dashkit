import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MarkdownDialogTrigger } from './markdown-dialog-trigger';

@Component({
  imports: [MarkdownDialogTrigger],
  template: `<button [gdMarkdownDialog]="load">Hello</button>`,
})
class Host {
  load = () => Promise.resolve('# Hello');
}

describe('MarkdownDialogTrigger', () => {
  it('opens the markdown of the given loader in a dialog on click', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button').click();

    // The dialog opens only after the markdown has loaded, so wait for it.
    const dialog = await vi.waitFor(() =>
      TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(MatDialogHarness),
    );
    expect(await dialog.getContentText()).toContain('Hello');
  });
});
