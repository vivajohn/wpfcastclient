import { FileTypes } from './file-types';

export class PlayItem {
  private static _id = Date.now();

  id: number;
  name: string;
  type: FileTypes;
  url: string;

  constructor(name: string, type: FileTypes, url: string) {
    this.id = PlayItem._id;
    PlayItem._id++;
    
    this.name = name;
    this.type = type;
    this.url = url;
  }
}
