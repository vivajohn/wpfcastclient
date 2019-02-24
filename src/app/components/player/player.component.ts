import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AudioPlusComponent } from '../audio-plus/audio-plus.component';
import { PlayItem } from 'src/app/classes/play-item';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { FileTypes } from 'src/app/classes/file-types';
import { SignalrService } from 'src/app/services/signalr.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ConfigService } from 'src/app/services/config.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('faderOut', [
      state('start', style({
        opacity: 0.8
      })),
      state('fadeOut', style({
        opacity: 0
      })),
      state('ended', style({
        opacity: 0
      })),
      transition('start => fadeOut', animate('1000ms 1000ms')),
      transition('* => start', animate(500))
    ])
  ]
})
export class PlayerComponent implements AfterViewInit {

  readonly PAUSE_TIME = 500;

  @ViewChild('audioPlayer', { read: AudioPlusComponent }) player: AudioPlusComponent;

  wait = false;
  fadeState: string;
  source: string;
  
  private firstTime = true;
  private autoPlay = false;
  private fadeCount = 0;

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar, 
    private signalr: SignalrService,
    public playlist: PlaylistService,
    private config: ConfigService) {

      playlist.newList.subscribe(() => {
        if (this.fadeCount < 2) {
          this.fadeState = null;
          this.setFadeState('start');
          this.fadeCount++;
        }        
      });
    }

  ngAfterViewInit() {
    // Start the next song when one has finished
    this.player.ended.subscribe(() => {
      this.playNext();
    });

    this.playlist.onNewSelection.subscribe(item => {
      this.player.stop();
      if (!item) {
        this.source = null;
        return;
      }
      this.makeSourceUrl(item).subscribe(url => this.setSourceUrl(url));
    });

    this.signalr.isConnected.subscribe(connected => {
      if (!connected) {
        this.playlist.removeNonLocal();
        this.playlist.library = null;
      }
    });
  }

  // Changes the state for the drop message animation
  onFadeOutDone() {
    if (this.fadeState === 'start') {
      this.setFadeState('fadeOut');
    } else if (this.fadeState === 'fadeOut') {
      this.setFadeState('ended');
    }
  }

  onUpload(items: PlayItem[]) {
    this.playlist.addItems(items);
  }

  // Drag and drop within the playlist
  onDrop(event: CdkDragDrop<string[]>) {
    this.playlist.moveItem(event.previousIndex, event.currentIndex);
  }

  toggleShuffle() {
    this.playlist.isShuffle = !this.playlist.isShuffle;
    if (this.firstTime) {
      this.playlist.resetSelected();
    }
  }

  get loopTip() {
    return this.playlist.isLoop ? 'Looping is ON' : 'Looping is OFF';
  }

  get shuffleTip() {
    return this.playlist.isShuffle ? 'The list is shuffled' : 'The list is not shuffled';
  }

  // Remove a file and play the next one if possible
  remove(item: PlayItem) {
    if (this.playlist.selected === item) {
      this.player.stop();
      if (this.playlist.canNext()) {
        this.playlist.moveNext();
      }
    }
    this.playlist.remove(item);
  }

  onSelect(item: PlayItem) {
    this.player.stop();
    this.playlist.setSelected(item);
  }

  onPlayPause() {
    if (this.player.isPlaying) {
      this.autoPlay = false;
      this.player.pause();
    } else {
      this.autoPlay = true;
      if (!this.playlist.selected) {
        this.playlist.resetSelected();
      }
      this.startPlay(0);
    }
  }

  onNext() {
    this.playlist.moveNext();
  }

  onPrevious() {
    this.playlist.movePrev();
  }
  

  private setFadeState(newState: string) {
    setTimeout(() => this.fadeState = newState, 100);
  }

  private makeSourceUrl(item: PlayItem): Observable<string> {
    const s = new ReplaySubject<string>(1);
    switch (item.type) {
      case FileTypes.Radio:
        const urlRadio = `${this.config.urlRest}/music/radio/${item.id}`;
        s.next(urlRadio);
        s.complete();
        break;
      case FileTypes.Stream:
        const urlFile = `${this.config.urlRest}/music/playitem`;
        this.http.post(urlFile, item, {  responseType: 'blob' }).subscribe(blob => {
          s.next(URL.createObjectURL(blob));
          s.complete();
        });
        break;
      case FileTypes.Url:
        s.next(item.url);
        s.complete();
        break;
    }
    return s;
  }

  private setSourceUrl(url: string, pauseTime = this.PAUSE_TIME) {
    this.source = url;
    if (this.autoPlay) {
      setTimeout(() => {
        this.wait = false;
        this.player.play().catch(err => {
          console.log(err);
          this.onError(this.playlist.selected);
        });
      }, pauseTime); // pause between files
    }
  }

  private playNext() {
    if (this.playlist.canNext()) {
      this.playlist.moveNext();
      this.startPlay(this.PAUSE_TIME);
    } else {
      this.playlist.setSelected(null);
    }
  }
  
  private startPlay(pauseTime = this.PAUSE_TIME) {
    if (!this.playlist.selected) {
      return;
    }
    this.firstTime = false;
    this.player.play();
  } 

  private onError(item: PlayItem) {
    const message = 'Error playing ' + item.name;
    this.snackBar.open(message, 'Error', { duration: 5000 });
    this.remove(item);
  }

}
