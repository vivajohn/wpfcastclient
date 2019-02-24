import { TestBed } from '@angular/core/testing';

import { FileListService } from './file-list.service';

describe('PlaylistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileListService = TestBed.get(FileListService);
    expect(service).toBeTruthy();
  });
});
