import { Component } from '@angular/core';
import { HelpComponent } from '../help/help.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.scss']
})
export class HelpButtonComponent {

  constructor(public dialog: MatDialog) { }

  openHelp() {
    this.dialog.open(HelpComponent, {
      width: '400px',
      panelClass: 'help-dialog'
    });
  }

}
