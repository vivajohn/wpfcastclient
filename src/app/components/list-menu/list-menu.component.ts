import { Component } from '@angular/core';
import { SignalrService } from 'src/app/services/signalr.service';
import { LibHeader, LibInfo } from 'src/app/classes/lib-info';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent {

  list: LibHeader[] = [];
  private libHeaders: LibHeader[];
  private currentPath: string;

  constructor(private signaler: SignalrService, listMgr: PlaylistService, public dialog: MatDialog) { 
    signaler.register('LibraryNames').subscribe((libHeaders: LibHeader[]) => {
      this.libHeaders = libHeaders;
      this.currentPath = listMgr.library ? listMgr.library.libPath : null;
      this.setList(this.currentPath);
    });
    this.signaler.register('Library').subscribe((libinfo: LibInfo) => this.currentPath = libinfo.libPath);

    signaler.notify('GetLibraryNames');
  }

  onDelete(e: Event, libHeader: LibHeader) {
    e.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDeleteComponent, { panelClass: 'confirm-dialog' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.signaler.send('DeleteLibrary', libHeader);
      }
    });
  }

  onSelect(libHeader: LibHeader) {
    if (libHeader.libPath !== this.currentPath) {
      this.signaler.send('GetLibrary', libHeader.libPath);
      // this.setList(libHeader.libPath);
    }
  }

  private setList(current: string) {
    // Do not show the currently selected playlist
    // this.list = this.libHeaders.filter(x => x.libPath !== current);

    this.list = this.libHeaders; // allows user to delete current playlist
  }

}
