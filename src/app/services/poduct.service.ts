import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registerModel } from '../models/registerModel';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoductService {

  private url = 'http://localhost:3000';
  constructor( private http: HttpClient) {}

  registroProducto(producto: registerModel): Observable<any> {
    return this.http.post(`${this.url}/api/product`, producto)
      .pipe(
        
        catchError(error => {
          console.error('Error al registrar producto:', error);
          throw error;  
        })
      );
  }


  obtenerRegistros(): Observable<any> {

    return this.http.get(`${this.url}/api/product`)
  }

  


}

  
