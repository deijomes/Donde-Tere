import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registerModel } from '../models/registerModel';
import { catchError, Observable } from 'rxjs';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class PoductService {

  private url = 'http://localhost:3000/api/product';
  constructor( private http: HttpClient) {}

  registroProducto(producto: registerModel): Observable<any> {
    return this.http.post(`${this.url}`, producto)
      .pipe(
        
        catchError(error => {
          console.error('Error al registrar producto:', error);
          throw error;  
        })
      );
  }


  obtenerRegistros(): Observable<any> {

    return this.http.get(`${this.url}`)
  }

  prodoctoEditar(id:string):Observable<any>{

    return this.http.get(`${this.url}/${id}`)
  }

  EditarProducto(id: string, producto:registerModel):  Observable<any>{
    return this.http.patch(`${this.url}/${id}`, producto)

    .pipe(catchError(error=>{
      console.error('error al actualizar', error);
      throw error
    })

    )
  }

  eliminarProducto(id:string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        throw error; 
      })
    );
  }
  


}

  
