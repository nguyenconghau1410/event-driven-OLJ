import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../constant';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(idToken: String): Observable<any> {
    return this.http.get(`${API_URL.login}/${idToken}`)
  }
}
