import { Injectable } from '@angular/core';
import { PlayItem } from '../classes/play-item';
import { Observable, Subject, of, merge, ReplaySubject } from 'rxjs';
import { FileTypes } from '../classes/file-types';
import { MatSnackBar } from '@angular/material/snack-bar';

// Converts an html file list to a list of PlayItem objects

@Injectable({
  providedIn: 'root'
})
export class FileListService {

  playlist: PlayItem[];
  originalItems: PlayItem[];

  constructor(private snackBar: MatSnackBar) { }

  toPlaylist(files: FileList): Observable<PlayItem[]> {
    const s = new ReplaySubject<PlayItem[]>();
    const errors: PlayItem[] = [];
    const items: PlayItem[] = [];
    this.createPlayItems(files).subscribe(item => {
      if (item.url) {
        items.push(item);
      } else {
        errors.push(item);
      }
    }, err => {
      console.log('Playlist error: ', err);
    }, () => {
      s.next(items);
      s.complete();
      if (errors.length > 0) {
        const message =  errors.length > 1 ? 'Errors reading multiple files' : 'Error reading ' + errors[0].name;
        this.snackBar.open(message, 'Error', { duration: 3000 });
      }
    });
    return s;
  }

  private createPlayItems(files: FileList): Observable<PlayItem> {
    const obsList: Observable<PlayItem>[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('audio/')) {
        obsList.push(this.makePlayItem(files[i]));
      } 
    }
    return merge(...obsList);
  }

  private makePlayItem(file: File): Observable<PlayItem> {
    const name = file.name.split('.')[0];
    if (file.name.includes('.m3u') || file.type.includes('mpegurl')) {
      const s = new Subject<PlayItem>();
      this.m3uToUrl(file).subscribe(url => {
        s.next(new PlayItem(name, FileTypes.Url, url));
        s.complete();
      });
      return s;
    }
    return of(new PlayItem(name, FileTypes.Url, URL.createObjectURL(file)));
  }

  private m3uToUrl(file: File): Observable<string> {
    const s = new Subject<string>();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let result = null;
      const lines: string[] = e.target.result.split(/\r?\n/g);
      if (lines.length > 0) {
        result = lines[0].trim();
      }
      s.next(result);
      s.complete();
    };
    reader.readAsText(file);
    return s;
  }
}
