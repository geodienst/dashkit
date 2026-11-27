import { Directive, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownDialog } from './markdown-dialog';

// Opens the markdown returned by the given loader in a MarkdownDialog on click.
@Directive({
  selector: '[gdMarkdownDialog]',
  host: { '(click)': 'open()' },
})
export class MarkdownDialogTrigger {
  readonly gdMarkdownDialog = input.required<() => Promise<string>>();
  private readonly dialog = inject(MatDialog);

  protected async open() {
    this.dialog.open(MarkdownDialog, { data: await this.gdMarkdownDialog()() });
  }
}
