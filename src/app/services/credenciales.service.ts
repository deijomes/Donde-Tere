import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/registerUsuario';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  private url = 'http://localhost:3000/api/auth/register';
  private urlLogin = 'http://localhost:3000/api/auth/login';
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) { }


  login(usuario: UsuarioModel): Observable<any> {
    const authdata = {
      email: usuario.email,
      password: usuario.password
    };

    return this.http.post(`${this.urlLogin}`, authdata)
      .pipe(
        map((response: any) => {
          console.log('Login exitoso', response);
          if (response?.token) {
            sessionStorage.setItem(this.tokenKey, response.token);

            if (response?.email) {
              localStorage.setItem('email', response.email);
            }
            if (response?.roles) {
              localStorage.setItem('rol', response.roles);
            }
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
          console.log('Nuevo usuario registrado', response);
          if (response?.token) {
            sessionStorage.setItem(this.tokenKey, response.token);

          }
          if (response?.email) {
            localStorage.setItem('email', response.email);
          }
          if (response?.roles) {
            localStorage.setItem('rol', response.roles);
          }
          return response;

        }),
        catchError(this.manejarError)
      );
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  cerrarSesion(): void {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
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
