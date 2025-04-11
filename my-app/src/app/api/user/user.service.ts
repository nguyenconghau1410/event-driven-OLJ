import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, API_URL_ADMIN, decrypt, headers } from '../../constant';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }

  getUser(): Observable<User> {
    const access_token = sessionStorage.getItem('access_token');
    const decryptToken = decrypt(access_token as string);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${decryptToken}`)
    return this.http.get<User>(`${API_URL.getUser}`, { headers: headers })
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(
      `${API_URL.updateUser}`,
      data,
      { headers: headers }
    )
  }

  getUserEmail(email: string): Observable<any> {
    return this.http.get(
      `${API_URL.getUserEmail}/${email}`,
      { headers: headers }
    )
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getUserById}/${id}`,
      { headers: headers }
    )
  }

  getInfoUser(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getUserInfo}/${id}`,
      { headers: headers }
    )
  }
  // administration
  getAllUsers(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.getAllUsers}/${pageNumber}`,
      { headers: headers }
    )
  }

  countAllUsers(): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.countAllUsers}`,
      { headers: headers }
    )
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(
      `${API_URL_ADMIN.deleteUser}/${id}`,
      { headers: headers }
    )
  }

  exchangeRole(data: any): Observable<any> {
    return this.http.put(
      API_URL_ADMIN.exchangeRole,
      data,
      { headers: headers }
    )
  }

  search(keyword: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.searchUser}/${keyword}/${pageNumber}`,
      { headers: headers }
    )
  }
}
