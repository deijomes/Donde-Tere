import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = `${environment.API_URL}/api/auth/users`;

  constructor( private http :HttpClient) { }

  getUser(): Observable<any> {
      
      return this.http.get(this.url);
    }
    
}
