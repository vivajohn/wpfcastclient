import { Component, Output, EventEmitter } from '@angular/core';
import { PlayItem } from 'src/app/classes/play-item';
import { FileListService } from 'src/app/services/file-list.service';
import { ConfigService } from 'src/app/services/config.service';
import { SignalrService } from 'src/app/services/signalr.service';

@Component({
  selector: 'upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {

  @Output() upload = new EventEmitter<PlayItem[]>();

  constructor(public config: ConfigService, private fileListSvc: FileListService, public signaler: SignalrService) { }

  onUpload(files: FileList) {
    this.fileListSvc.toPlaylist(files).subscribe(items => this.upload.emit(items));
  }

}
