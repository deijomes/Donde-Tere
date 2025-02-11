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





 

  // Método para construir la URL con los parámetros
  buildUrl(limit?: number, offset?: number, productName?: string, startDate?:string, endDate?: string): string {
    let url = this.urlmov
  
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    if (productName) {
      params = params.set('productName', productName);
    }

    if (endDate) {
      params = params.set('endDate', endDate);  // Formato yyyy-MM-dd
    }

    if (startDate) {
      params = params.set('startDate', startDate);  // Formato yyyy-MM-dd
    }


    if (params.toString()) {
      url += '?' + params.toString();
    }

    return url;
  }

  // Método para realizar la solicitud HTTP GET con los parámetros
  getDatos(limit?: number, offset?: number, productName?: string, endDate?: string, startDate?:string): Observable<any> {
    const url = this.buildUrl(limit, offset, productName, startDate, endDate);
    console.log(url, 'esta es la url')
    return this.http.get<any>(url);

  }

  isValidDate(dateString: string): boolean {
    // Primero intentamos con el formato YYYY-MM-DD
    const regExp = /^\d{4}-\d{2}-\d{2}$/;
    if (regExp.test(dateString) && !isNaN(new Date(dateString).getTime())) {
      return true;
    }

    // Intentamos con el formato DD-MM-YYYY
    const regExpAlt = /^\d{2}-\d{2}-\d{4}$/;
    if (regExpAlt.test(dateString)) {
      // Convertimos el formato DD-MM-YYYY a YYYY-MM-DD
      const [day, month, year] = dateString.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      return !isNaN(new Date(formattedDate).getTime());
    }

    return false;
  }

  // Función para convertir la entrada a fecha o tratarla como nombre
  convertToDateString(input: string): { isDate: boolean, startDate?: string, endDate?: string, name?: string } {
    if (this.isValidDate(input)) {
      // Si es una fecha válida, convertir a formato YYYY-MM-DDTHH:mm:ss.sssZ
      let formattedInput = input;
      // Si es formato DD-MM-YYYY, convertirlo
      if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
        const [day, month, year] = input.split('-');
        formattedInput = `${year}-${month}-${day}`;
      }
      
      const startDate = new Date(formattedInput + 'T00:00:00.000Z');
      const endDate = new Date(formattedInput + 'T23:59:59.999Z');
      
      return {
        isDate: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    } else {
      // Si no es una fecha, tratarlo como nombre
      return {
        isDate: false,
        name: input,
      };
    }
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













