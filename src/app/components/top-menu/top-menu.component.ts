import { Component, Output, EventEmitter } from '@angular/core';
import { PlayItem } from 'src/app/classes/play-item';
import { ConfigService } from 'src/app/services/config.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { LibInfo, LibHeader } from 'src/app/classes/lib-info';
import { DlgStringComponent } from '../dlg-string/dlg-string.component';
import { MatDialog } from '@angular/material/dialog';
import { FileTypes } from 'src/app/classes/file-types';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent {

  @Output() upload = new EventEmitter<PlayItem[]>();

  constructor(
    public config: ConfigService, 
    private signaler: SignalrService, 
    private listMgr: PlaylistService, 
    public dialog: MatDialog) { }
  
  onSave() {
    // Do not save any files which were loaded while the server was not running
    const items = this.listMgr.playItems.filter(x => x.type !== FileTypes.Url);

    const lib = this.listMgr.library ? this.listMgr.library : new LibHeader();

    this.dialog.open(DlgStringComponent, {
      data: { name: lib.name },
      panelClass: 'string-dialog',
      position: { top: '100px', right: '160px'}
    }).afterClosed().subscribe(name => {
      if (name) {
        const libInfo = new LibInfo(lib.libPath, name, items);
        this.signaler.send('SaveLibrary', libInfo);
      }
    });
  }
}
