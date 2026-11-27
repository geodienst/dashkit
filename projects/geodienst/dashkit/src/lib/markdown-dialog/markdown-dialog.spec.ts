import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarkdownDialog } from './markdown-dialog';

describe('MarkdownDialog', () => {
  it('renders the given markdown as HTML', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: MAT_DIALOG_DATA, useValue: '# Title\n\nSome text' }] });
    const fixture = TestBed.createComponent(MarkdownDialog);
    await fixture.whenStable();

    const content = fixture.nativeElement.querySelector('mat-dialog-content');
    expect(content.querySelector('h1')?.textContent).toBe('Title');
    expect(content.querySelector('p')?.textContent).toBe('Some text');
  });

  it('closes the dialog via the close button', async () => {
    const dialogRef = { close: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'Some text' },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    });
    const fixture = TestBed.createComponent(MarkdownDialog);

    await (await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness)).click();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
