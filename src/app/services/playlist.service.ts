import { Injectable } from '@angular/core';
import { PlayItem } from '../classes/play-item';
import { ReplaySubject } from 'rxjs';
import { FileTypes } from '../classes/file-types';
import { LibHeader, LibInfo } from '../classes/lib-info';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private originalItems: PlayItem[] = [];

  private _isShuffle = false;
  get isShuffle(): boolean {
    return this._isShuffle;
  }
  set isShuffle(value: boolean) {
    this._isShuffle = value;
    this.setPlaylist();
  }

  private _selected: PlayItem;
  get selected(): PlayItem {
    return this._selected;
  }

  newList = new ReplaySubject<PlayItem[]>(1);
  onNewSelection = new ReplaySubject<PlayItem>(1);
  playItems: PlayItem[] = [];
  isLoop = true;
  library: LibHeader;

  // Set a new list
  setItems(libInfo: LibInfo) {
    this._selected = null;
    this.originalItems = [];
    this.playItems = [];
    if (!libInfo) {
      this.library = null;
      return;
    }
    this.library = new LibHeader(libInfo.libPath, libInfo.name);
    this.addItems(libInfo.items);
  }
  
  // Add items to the existing list
  addItems(items: PlayItem[]) {
    if (!items || items.length === 0) {
      return;
    }

    if (this.originalItems.length === 0) {
      this.originalItems = [...items];
    } else {
      this.mergeNewItems(items);
    }

    // 11-aug-2019, removed to preserve user's order
    // this.originalItems.sort((itemA, itemB) => {
    //   const a = itemA.name.toUpperCase();
    //   const b = itemB.name.toUpperCase();
    //   return (a < b) ? -1 : (a > b) ? 1 : 0;
    // });

    this.setPlaylist();

    if (!this.selected) {
      this.resetSelected();
    }

    this.newList.next(this.playItems);
  }

  onLibrarySaved(libHeader: LibHeader) {
    this.library = libHeader;
  }

  canNext(): boolean {
    return this.isLoop ? true : this.currentIndex < (this.playItems.length - 1);
  }

  canPrev(): boolean {
    return this.isLoop ? true : this.currentIndex > 0;
  }

  moveNext() {
    if (this.canNext()) {
      this.move(1);
    }
  }

  movePrev() {
    if (this.canPrev()) {
      this.move(-1);
    }
  }

  remove(file: PlayItem) {
    this.originalItems.splice(this.originalItems.indexOf(file), 1);
    const i = this.playItems.indexOf(file);
    this.playItems = [...this.playItems.slice(0, i), ...this.playItems.slice(i + 1)];
  }

  resetSelected() {
    this.setSelected(this.playItems.length === 0 ? null : this.playItems[0]);
  }

  moveItem(iFrom: number, iTo: number) {
    this.moveItemInArray(this.playItems, iFrom, iTo);
    if (!this.isShuffle) {
      this.moveItemInArray(this.originalItems, iFrom, iTo);
    }
  }

  setSelected(item: PlayItem) {
    if (this._selected === item) {
      return;
    }
    this._selected = item;
    this.onNewSelection.next(item);
  }

  // When we have disconnected from the server, remove all urls which
  // were sent from the server.
  removeNonLocal() {
    const items = [...this.originalItems];
    items.forEach(item => {
      if (item.type !== FileTypes.Url) {
        this.remove(item);
      }
    });
    if (this.originalItems.indexOf(this._selected) < 0) {
      this.resetSelected();
    }
  }


  private mergeNewItems(items: PlayItem[]) {
    const newItems: PlayItem[] = [];
    let newSelect: PlayItem;
    const selectName = this._selected ? this._selected.name : null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const j = this.originalItems.findIndex(x => x.name === item.name);
      if (j < 0) {
        newItems.push(item);
      } else {
        this.originalItems[j] = item;
        if (item.name === selectName) {
          newSelect = item;
        }
      }
    }
    this.originalItems = this.originalItems.concat(newItems);
    if (newSelect) {
      this.setSelected(newSelect);
    }
  }

  private moveItemInArray(array: any[], iFrom: number, iTo: number) {
    const item = array[iFrom];
    array.splice(iFrom, 1);
    array.splice(iTo, 0, item);
  }

  private get currentIndex(): number {
    return this.playItems.indexOf(this.selected);
  }

  private move(delta: number) {
    if (this.playItems.length === 0) {
      this.setSelected(null);
      return;
    }
    const i = (this.originalItems.length + this.currentIndex + delta) % this.originalItems.length;
    this.setSelected(this.playItems[i]);
  }
    
  private setPlaylist() {
    this.playItems = !this.originalItems ? [] : [...this.originalItems];

    if (this.isShuffle) {
      this.shuffle();
    }
  }

  private shuffle() {
    let i = this.originalItems.length;
    let temp;
    let iRandom;

    // While there remain elements to shuffle...
    while (0 !== i) {
  
      // Pick a remaining element...
      iRandom = Math.floor(Math.random() * i);
      i -= 1;
  
      // And swap it with the current element.
      temp = this.playItems[i];
      this.playItems[i] = this.playItems[iRandom];
      this.playItems[iRandom] = temp;
    }
  }

}
