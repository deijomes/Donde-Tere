import { TestBed } from '@angular/core/testing';

import { PoductService } from './poduct.service';

describe('PoductService', () => {
  let service: PoductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
