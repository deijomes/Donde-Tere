import { Injectable } from '@angular/core';
import { registroModel } from '../models/registroModel';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor() { }


  private terminosBusqueda = new BehaviorSubject<{ [contexto: string]: string }>({});
  terminosBusqueda$ = this.terminosBusqueda.asObservable();

  setTerminoBusqueda(termino: string, contexto: string): void {
    const nuevosTerminos = { ...this.terminosBusqueda.value, [contexto]: termino };
    this.terminosBusqueda.next(nuevosTerminos);
  }

  getTerminoBusqueda(contexto: string): string {
    return this.terminosBusqueda.value[contexto] || '';
  }

  limpiarBusqueda(contexto: string): void {
    const nuevosTerminos = { ...this.terminosBusqueda.value };
    delete nuevosTerminos[contexto];
    this.terminosBusqueda.next(nuevosTerminos);

    this.terminosBusqueda.next(Object.keys(nuevosTerminos).length ? nuevosTerminos : {});
  }

}

