import { TestBed } from '@angular/core/testing';

import { CycleServiceService } from './cycle-service.service';

describe('CycleServiceService', () => {
  let service: CycleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CycleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
