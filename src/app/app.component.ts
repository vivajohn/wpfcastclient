import { Component, ViewChild, ElementRef} from '@angular/core';
import { PlayItem } from './classes/play-item';
import { Observable, Subject, of, interval, merge } from 'rxjs';
import { map, mapTo, last, filter, catchError, onErrorResumeNext } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { SignalrService } from './services/signalr.service';
import { FileTypes } from './classes/file-types';
import { FileListService } from './services/file-list.service';
import { PlaylistService } from './services/playlist.service';
import { ConfigService } from './services/config.service';
import { LibInfo } from './classes/lib-info';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('dropTarget') dropTarget: ElementRef;
  
  isFileHover = false;

  constructor(
    public signaler: SignalrService, 
    private fileListSvc: FileListService,
    private listMgr: PlaylistService,
    public config: ConfigService) {

    this.setupSignalr();
    this.signaler.isConnected.subscribe(b => config.isStandAlone = !b);
  }

  get showPlayer(): boolean {
    if (this.config.isStandAlone) {
      return this.listMgr.playItems.length > 0;
    }
    if (this.listMgr.playItems.length > 0) {
      return true;
    }
    return this.listMgr.playItems.length === 0 && !!this.listMgr.library;
  }

  onDrag(isOver: boolean) {
    this.isFileHover = isOver;
    this.signaler.notify('Drag');
  }

  onUpload(items: PlayItem[]) {
    this.listMgr.addItems(items);
  }

  dropped(files: FileList) {
    this.fileListSvc.toPlaylist(files).subscribe(items => this.listMgr.addItems(items));
  }
  
  // Set up to receive calls on the SignalR pipeline
  private setupSignalr() {
    this.signaler.register('AddItems').subscribe((items: PlayItem[]) => {
      this.listMgr.addItems(items);
    });
    this.signaler.register('Library').subscribe((libinfo: LibInfo) => this.listMgr.setItems(libinfo));
  }

}
