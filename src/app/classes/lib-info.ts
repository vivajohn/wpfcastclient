import { PlayItem } from './play-item';

export class LibHeader {
    public libPath: string;
    public name: string ;

    constructor(libPath?: string, name?: string) {
      this.libPath = libPath;
      this.name = name;
    }
}

export class LibInfo extends LibHeader {
    public items: PlayItem[];

    constructor(libPath: string, name: string, items: PlayItem[]) {
      super(libPath, name);
      this.items = items;
    }
}
