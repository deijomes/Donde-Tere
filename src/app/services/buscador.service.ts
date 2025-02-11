import { Injectable } from '@angular/core';
import { registroModel } from '../models/registroModel';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor() { }



  private terminoBusquedaSubject = new BehaviorSubject<string>(''); // Estado compartido
  terminoBusqueda$ = this.terminoBusquedaSubject.asObservable(); // Observable para escuchar cambios

  private terminoBusquedaProductos = new BehaviorSubject<string>('');
  terminoBusquedaProductos$ = this.terminoBusquedaProductos.asObservable();

  



  setTerminoBusqueda(termino: string): void {
    this.terminoBusquedaSubject.next(termino);
   
  }
  setTerminoBusquedaProductos(termino: string): void {
    this.terminoBusquedaProductos.next(termino);
  }


}

