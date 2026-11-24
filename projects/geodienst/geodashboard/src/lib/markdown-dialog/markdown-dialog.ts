import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { marked } from 'marked';

@Component({
  imports: [MatDialogClose, MatDialogContent, MatIcon, MatIconButton],
  selector: 'gd-markdown-dialog',
  styleUrl: './markdown-dialog.css',
  templateUrl: './markdown-dialog.html',
})
export class MarkdownDialog {
  protected readonly html = marked.parse(inject<string>(MAT_DIALOG_DATA), { async: false });
}
