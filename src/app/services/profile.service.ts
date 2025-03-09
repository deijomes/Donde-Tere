import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { edicionUser } from '../models/editarUser.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = `${environment.API_URL}/api/auth/users`;


  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {

    return this.http.get(this.url);
  }

  EditarUser(id: string, user:edicionUser): Observable<any> {
    return this.http.put(`${this.url}/${id}`, user)

      .pipe(catchError(error => {
        console.error('error al actualizar', error);
        throw error
      })

      )
  }



}
