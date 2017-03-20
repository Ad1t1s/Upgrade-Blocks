import { TestBed, inject } from '@angular/core/testing';

import { BlockService } from './block.service';

describe('BlockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlockService]
    });
  });

  it('should ...', inject([BlockService], (service: BlockService) => {
    expect(service).toBeTruthy();
  }));
});
