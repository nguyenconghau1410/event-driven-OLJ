import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contest } from '../../models/contest.model';
import { API_URL, API_URL_ADMIN, headers } from '../../constant';
import { Submit } from '../../models/submit.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(
    private http: HttpClient
  ) { }

  create(contest: Contest): Observable<any> {
    return this.http.post(
      API_URL.addContest,
      contest,
      { headers: headers }
    )
  }

  getOne(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getContestByCreator}/${pageNumber}`,
      { headers: headers }
    )
  }

  countContest(): Observable<any> {
    return this.http.get(
      API_URL.countContest,
      { headers: headers }
    )
  }

  getContest(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getContest}/${id}`,
      { headers: headers }
    )
  }

  update(contest: Contest): Observable<any> {
    return this.http.put(
      API_URL.updateContest,
      contest,
      { headers: headers }
    )
  }

  getChallenges(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getChallenges}/${id}/${pageNumber}`,
      { headers: headers },
    )
  }

  getParticipants(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getParticipants}/${id}/${pageNumber}`,
      { headers: headers }
    )
  }

  getSignups(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getSignups}/${id}/${pageNumber}`,
      { headers: headers }
    )
  }

  addSubmission(submit: Submit): Observable<any> {
    return this.http.post(
      API_URL.addSubmissionContest,
      submit,
      { headers: headers }
    )
  }

  getSubmission(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getSubmissionContest}/${id}`,
      { headers: headers }
    )
  }

  countSubmissionsContest(contestId: string, userId: string, problemId: string): Observable<any> {
    return this.http.get(
      `${API_URL.countSubmissionsContest}/${contestId}/${userId}/${problemId}`,
      { headers: headers }
    )
  }

  getAllSubmissionOfContest(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getAllSubmissionOfContest}/${id}/${pageNumber}`,
      { headers: headers }
    )
  }

  getMySubmissionOfContest(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getMySubmissionOfContest}/${id}/${pageNumber}`,
      { headers: headers }
    )
  }

  getSubmissionOfProblemInContest(id: string, problemId: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getSubmissionOfProblemInContest}/${id}/${problemId}/${pageNumber}`,
      { headers: headers }
    )
  }

  getLeaderBoardList(id: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getLeaderBoardList}/${id}/${pageNumber}`,
      { headers: headers }
    )
  }

  getDetailLeaderboard(contestId: string, userId: string): Observable<any> {
    return this.http.get(
      `${API_URL.getDetailLeaderboard}/${contestId}/${userId}`,
      { headers: headers }
    )
  }

  getContestList(pageNumber: number, isFinished: boolean): Observable<any> {
    return this.http.get(
      `${API_URL.getContestList}/${pageNumber}/${isFinished}`
    )
  }

  countContestList(isFinished: boolean): Observable<any> {
    return this.http.get(
      `${API_URL.countContestList}/${isFinished}`,
    )
  }

  getStatisticContest(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getStatisticContest}/${id}`,
      { headers: headers }
    )
  }

  getStatisticListContest(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.getStatisticListContest}/${id}`,
      { headers: headers }
    )
  }

  countLeaderBoard(id: string): Observable<any> {
    return this.http.get(
      `${API_URL.countLeaderBoard}/${id}`,
      { headers: headers }
    )
  }

  countHistoryContest(): Observable<any> {
    return this.http.get(
      API_URL.countHistoryContest,
      { headers: headers }
    )
  }

  getHistoryContest(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL.getHistoryContest}/${pageNumber}`,
      { headers: headers }
    )
  }

  getTopRating(contestId: string): Observable<any> {
    return this.http.get(
      `${API_URL.getTopRating}/${contestId}`,
      { headers: headers }
    )
  }

  // administration
  countContestOfCreator(): Observable<any> {
    return this.http.get(
      API_URL_ADMIN.countContestOfCreator,
      { headers: headers }
    )
  }

  getContestOfCreator(pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.getContestOfCreator}/${pageNumber}`,
      { headers: headers }
    )
  }

  countContestsCreator(email: string): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.countContestsCreator}/${email}`,
      { headers: headers }
    )
  }

  getContestsCreator(email: string, pageNumber: number): Observable<any> {
    return this.http.get(
      `${API_URL_ADMIN.getContestsCreator}/${email}/${pageNumber}`,
      { headers: headers }
    )
  }

  deleteContest(contestId: string): Observable<any> {
    return this.http.delete(
      `${API_URL_ADMIN.deleteContest}/${contestId}`,
      { headers: headers }
    )
  }
}
