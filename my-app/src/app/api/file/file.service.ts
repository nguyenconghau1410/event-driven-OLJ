import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, API_URL_ADMIN, headers } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(files: File[], folder: string, type: string): Observable<any> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    formData.append('folder', folder)
    formData.append('type', type)
    return this.http.post(API_URL.uploadFile, formData)
  }

  deleteFolder(nameFolder: string): Observable<any> {
    return this.http.delete(`${API_URL.deleteFolder}/${nameFolder}`, { headers: headers })
  }

  getFolder(): Observable<any> {
    return this.http.get(
      API_URL_ADMIN.getFolders,
      { headers: headers }
    )
  }
}
