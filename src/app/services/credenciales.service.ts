import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/registerUsuario';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  private url = 'http://localhost:3000/api/auth/register'

  constructor(private http: HttpClient) { }

  nuevoUsuario(usuario: UsuarioModel): Observable<any> {
    

    return this.http.post(`${this.url}`, usuario)
      .pipe(
        map((response: any) => {
          console.log('Nuevo usuario registrado', response);
          console.log(response['token']);
          return response;
        }),
        catchError(this.manejarError)
      );
  }

  private manejarError(error: any): Observable<never> {
    let mensajeError = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
    } else {
      mensajeError = `Error código ${error.status}: ${error.message}`;
    }
    return throwError(mensajeError);
  }

}
