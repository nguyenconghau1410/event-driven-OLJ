import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../api/user/user.service';
import { User } from '../../models/user.model';
import { Contest } from '../../models/contest.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<string | null>(null)
  public user: Observable<User> | undefined

  constructor() {
    this.user = this.userSubject.asObservable()
  }

  setUserSubject(user: User) {
    this.userSubject.next(user)
  }


}
