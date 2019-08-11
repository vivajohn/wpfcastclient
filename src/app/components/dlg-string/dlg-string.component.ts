import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dlg-string',
  templateUrl: './dlg-string.component.html',
  styleUrls: ['./dlg-string.component.scss']
})
export class DlgStringComponent {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<DlgStringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    this.name = data.name ? data.name : '';
  }

}
