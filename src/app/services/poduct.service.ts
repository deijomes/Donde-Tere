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
  private baseUrl= 'http://localhost:3000/api/sale'
  private urlstock = 'http://localhost:3000/api/Product/add-stock/'
  private urlmov= 'http://localhost:3000/api/movement'
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
  enviarVenta(cliente: string, saleItems: any[]): Observable<any> {
    const body = {customer: cliente, saleItems }; 
    console.log('Datos a enviar:', body); 
  
    return this.http.post(`${this.baseUrl}`,body).pipe(
      catchError(error => {
        console.error('Error al registrar venta:', error);
        throw error;
      })
    );
  }

  agregarstock(id: string, cantidad: number):Observable<any> {
    const body = {quantity: cantidad};
    return this.http.post(`${this.urlstock}${id}`,body).pipe(
      catchError(error => {
        console.error('Error al actualizarstock:', error);
        throw error;
      })
    );


  }

  getmovimientos(limit: number = 60, offset :number=0):Observable<any>{

    return this.http.get(`${this.urlmov}`, {
      params: {
      limit : limit.toString(),
      offset: offset.toString()
    }})

  }

  eliminarMovimiento(id: any): Observable<any>{

    return this.http.delete(`${this.urlmov}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        throw error; 
      })
    );

  }


  obtenerSalidas(limit: number = 20, offset: number = 0):Observable<any>{
    return this.http.get(`${this.baseUrl}`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    })

  }

  facturaVenta(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`)
    
  }


  


  


}

  
