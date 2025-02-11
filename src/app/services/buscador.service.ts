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

  



  setTerminoBusqueda(termino: string): void {
    this.terminoBusquedaSubject.next(termino); // Actualiza el término de búsqueda
    setTimeout(() => this.terminoBusquedaSubject.next(''), 500);
  }


}

