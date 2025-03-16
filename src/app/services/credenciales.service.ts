import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/registerUsuario';
import { catchError, map, Observable, throwError } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  private url = `${environment.API_URL}/api/auth/register`;
  private urlLogin = `${environment.API_URL}/api/auth/login`;
  private readonly tokenKey = 'token';
  private readonly fullname = 'name'

  constructor(private http: HttpClient) { }


  login(usuario: UsuarioModel): Observable<any> {
    const authdata = {
      email: usuario.email, // Asegúrate de usar "email" en lugar de "Emmail"
      password: usuario.password
    };

    return this.http.post(`${this.urlLogin}`, authdata)
      .pipe(
        map((response: any) => {

          console.log('Respuesta del servidor:', response);

         
          if (response?.token) {
            sessionStorage.setItem(this.tokenKey, response.token); 
           
           
          }
          

          return response;
          
          
          
        }),
        catchError(this.manejarError)
      );
  }

  nuevoUsuario(usuario: UsuarioModel): Observable<any> {
    

    return this.http.post(`${this.url}`, usuario)
      .pipe(
        map((response: any) => {
          
          
          return response;
          
        }),
        catchError(this.manejarError)
      );
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem(this.tokenKey); // Obtener el token almacenado
  }
 

  cerrarSesion(): void {
    sessionStorage.removeItem(this.tokenKey); // Eliminar el token al cerrar sesión
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
