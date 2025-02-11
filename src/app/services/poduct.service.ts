import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registerModel } from '../models/registerModel';
import { catchError, Observable } from 'rxjs';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class PoductService {

  private url = 'http://localhost:3000/api/product';
  private baseUrl = 'http://localhost:3000/api/sale'
  private urlstock = 'http://localhost:3000/api/Product/add-stock/'
  private urlmov = 'http://localhost:3000/api/movement'
  constructor(private http: HttpClient) { }

  registroProducto(producto: registerModel): Observable<any> {
    return this.http.post(`${this.url}`, producto)
      .pipe(

        catchError(error => {
          console.error('Error al registrar producto:', error);
          throw error;
        })
      );
  }


  obtenerRegistros(limit: number = 10000, offset: number = 0): Observable<any> {

    return this.http.get(`${this.url}`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()

      }
    })

  }

  prodoctoEditar(id: string): Observable<any> {

    return this.http.get(`${this.url}/${id}`)
  }

  EditarProducto(id: string, producto: registerModel): Observable<any> {
    return this.http.patch(`${this.url}/${id}`, producto)

      .pipe(catchError(error => {
        console.error('error al actualizar', error);
        throw error
      })

      )
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        throw error;
      })
    );
  }
  enviarVenta(cliente: string, identificacion: string, saleItems: any[]): Observable<any> {
    const body = { customer: cliente, identification: identificacion, saleItems };
    console.log('Datos a enviar:', body);

    return this.http.post(`${this.baseUrl}`, body).pipe(
      catchError(error => {
        console.error('Error al registrar venta:', error);
        throw error;
      })
    );
  }

  agregarstock(id: string, cantidad: number): Observable<any> {
    const body = { quantity: cantidad };
    return this.http.post(`${this.urlstock}${id}`, body).pipe(
      catchError(error => {
        console.error('Error al actualizarstock:', error);
        throw error;
      })
    );


  }



  getmovimientos(
    limit: number = 30,
    offset: number = 0,
    startDate: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    endDate: string = new Date().toISOString(),
    reason?: string,
    productId?: string,
    type?: string
  ): Observable<any> {

    let paramsObject: any = { limit, offset, startDate, endDate };

    if (reason) paramsObject.reason = reason;
    if (productId) paramsObject.productId = productId;
    if (type) paramsObject.type = type;

    let params = new HttpParams({ fromObject: paramsObject });

    const url = `${this.urlmov}?${params.toString()}`;
    console.log('URL generada:', url); // Verifica la URL en la consola

    return this.http.get(url);
  }

  getmovimiento(
    limit: number = 30,
    offset: number = 0,
    startDate: string = '',
    endDate: string = '',
    reason?: string,
    productId?: string
  ): Observable<any> {
    let paramsObject: any = { limit, offset };

    // Solo agregar parámetros que no sean vacíos
    if (startDate) paramsObject.startDate = startDate;
    if (endDate) paramsObject.endDate = endDate;
    if (reason) paramsObject.reason = reason;
    if (productId) paramsObject.productId = productId;

    // Convertir el objeto de parámetros a HttpParams
    let params = new HttpParams({ fromObject: paramsObject });

    // Generar la URL con los parámetros dinámicamente
    const url = `${this.urlmov}?${params.toString()}`;
    console.log('URL generada:', url); // Verifica la URL generada en la consola

    // Realizar la solicitud GET a la API
    return this.http.get(url);
  }



  eliminarMovimiento(id: any): Observable<any> {

    return this.http.delete(`${this.urlmov}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        throw error;
      })
    );

  }

  obtenerSalidas(limit: number = 30, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get(`${this.baseUrl}`, { params }); // ✅ Correcto
  }


  facturaVenta(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)

  }


}













