import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, API_URL_ADMIN, headers } from '../../constant';
import { Topic } from '../../models/topic.model';
@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(
    private http: HttpClient
  ) { }

  getAllTopic(): Observable<Topic[]> {
    return this.http.get<Topic[]>(API_URL.getAllTopic);
  }

  getTopicOfProblem(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getTopicOfProblem}/${id}`,
      { headers: headers }
    )
  }

  addTopic(topic: any): Observable<any> {
    return this.http.post(
      API_URL_ADMIN.addTopic,
      topic,
      { headers: headers }
    )
  }

  deleteTopic(id: string): Observable<any> {
    return this.http.delete(
      `${API_URL_ADMIN.deleteTopic}/${id}`,
      { headers: headers }
    )
  }
}
