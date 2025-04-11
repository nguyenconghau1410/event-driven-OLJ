import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { Observable } from 'rxjs';
import { Topic } from '../../models/topic.model';
import { API_URL, API_URL_ADMIN, headers } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  constructor(
    private http: HttpClient,
  ) { }

  addProblem(problem: Problem, topics: {}[]): Observable<any> {
    return this.http.post(
      API_URL.addProblem,
      {
        problem: problem,
        topics: topics
      },
      { headers: headers }
    )
  }

  getAllProblem(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getAllProblem}/${pageNumber}`,
    )
  }

  getProblem(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getProblem}/${id}`,
    )
  }

  getProblemByCreator(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getProblemByCreator}/${pageNumber}`,
      { headers: headers }
    )
  }

  countProblemByCreator(): Observable<any> {
    return this.http.get(
      API_URL.countProblemByCreator,
      { headers: headers }
    )
  }

  updateState(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.updateState}/${id}`,
      { headers: headers }
    )
  }

  update(problem: Problem, topics: Topic[]): Observable<any> {
    return this.http.put(
      API_URL.updateProblem,
      {
        problem: problem,
        topics: topics
      },
      { headers: headers }
    )
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      `${API_URL.deleteByProblemId}/${id}`,
      { headers: headers }
    )
  }

  getProblemByKeyword(keyword: string): Observable<any> {
    return this.http.get(
      `${API_URL.getProblemByKeyword}/${keyword}`,
      { headers: headers }
    )
  }

  getTotalRecord(): Observable<any> {
    return this.http.get(
      API_URL.getTotalRecordProblem
    )
  }

  getSearch(form: any): Observable<any> {
    return this.http.post(
      API_URL.getSearchProblem,
      form,
      { headers: headers }
    )
  }

  // administration
  getAll(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.getAllProblem}/${pageNumber}`,
      { headers: headers }
    )
  }

  countAll(): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.countAllProblem}`,
      { headers: headers }
    )
  }

  getDetailProblem(problemId: string): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.getDetailProblem}/${problemId}`,
      { headers: headers }
    )
  }

  getSearchAdmin(keyword: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.searchProblem}/${keyword}/${pageNumber}`,
      { headers: headers }
    )
  }
}
