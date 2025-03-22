import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductoCompraService {

  private baseUrl = `${environment.API_URL}/api/purchase`
  private url = `${environment.API_URL}/api/notifications`

  constructor(private http: HttpClient) { }

  enviarCompra(cliente: string, identificacion: string, purchaseItems: any[],  supplyItems: any[]): Observable<any> {
    const body = { supplier: cliente, identification: identificacion, purchaseItems, supplyItems };
   

    return this.http.post(`${this.baseUrl}`, body).pipe(
      catchError(error => {
        console.error('Error al registrar venta:', error);
        throw error;
      })
    );
  }

  
  enviarCompraProNoInv(cliente: string, identificacion: string, purchaseItems: any[],  supplyItems: any[]): Observable<any> {
    const body = { supplier: cliente, identification: identificacion, purchaseItems, supplyItems };
    

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

  eliminarFactura(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la factura:', error);
        return throwError(() => new Error('No se pudo eliminar la factura. Inténtalo nuevamente.'));
      })
    );
  }





  registrosCompras(limit: number): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString()); 
   
    console.log(`${this.baseUrl}?${params.toString()}`, 'esta es la url');
    return this.http.get(this.baseUrl, { params });
  }
  

 
  Notificaciones(): Observable<any> {
    
  
    return this.http.get<any[]>(`${this.url}`)
  }
  
  


}
