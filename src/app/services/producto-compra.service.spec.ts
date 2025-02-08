import { TestBed } from '@angular/core/testing';

import { ProductoCompraService } from './producto-compra.service';

describe('ProductoCompraService', () => {
  let service: ProductoCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
