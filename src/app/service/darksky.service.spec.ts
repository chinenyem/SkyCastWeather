import { TestBed, inject } from '@angular/core/testing';

import { DarkskyService } from './darksky.service';

describe('DarkskyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DarkskyService]
    });
  });

  it('should ...', inject([DarkskyService], (service: DarkskyService) => {
    expect(service).toBeTruthy();
  }));
});
