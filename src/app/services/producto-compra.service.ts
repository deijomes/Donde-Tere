import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductoCompraService {

  private baseUrl = `${environment.API_URL}/api/Purchase`
  private url = `${environment.API_URL}/api/notifications`

  constructor(private http: HttpClient) { }

  enviarCompra(cliente: string, identificacion: string, purchaseItems: any[]): Observable<any> {
    const body = { supplier: cliente, identification: identificacion, purchaseItems };
    console.log('Datos a enviar:', body);

    return this.http.post(`${this.baseUrl}`, body).pipe(
      catchError(error => {
        console.error('Error al registrar venta:', error);
        throw error;
      })
    );
  }

  facturaCompra(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)

  }




  registrosCompras(): Observable<any> {
    return this.http.get(`${this.baseUrl}`)

  }

 
  Notificaciones(): Observable<any> {
    
  
    return this.http.get<any[]>(`${this.url}`)
  }
  
  


}
