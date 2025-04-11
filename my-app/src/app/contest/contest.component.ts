import { Component } from '@angular/core';
import { ContestService } from '../api/contest/contest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest } from '../models/contest.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../service/data/data.service';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-contest',
  standalone: true,
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './contest.component.html',
  styleUrl: './contest.component.scss'
})
export class ContestComponent {
  check: boolean = false
  contestList: Contest[] = []
  contestFuture: Contest[] = []
  user!: User
  // pagination
  pageIndex = 1
  pageSize = 10
  total = 0

  pageIndex1 = 1
  total1 = 0
  constructor(
    private contestService: ContestService,
    private router: Router,
    private dataService: DataService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.contestService.getContestList(this.pageIndex - 1, true).subscribe(
          (data) => {
            if (data) {
              this.contestList = data
            }
          },
          (error) => {
            this.toastrService.error(
              'Đã có lỗi xảy ra, hãy thử lại!', '', { timeOut: 200 }
            )
          }
        )
      }
      else if (params['page1']) {
        this.contestService.getContestList(this.pageIndex1 - 1, false).subscribe(
          (data) => {
            if (data) {
              this.contestFuture = data
            }
          },
          (error) => {
            this.toastrService.error(
              'Đã có lỗi xảy ra, hãy thử lại!', '', { timeOut: 200 }
            )
          }
        )
      }
    })
    this.contestService.countContestList(true).subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      }, (error) => {
        this.check = true
      }
    )
    this.contestService.getContestList(this.pageIndex - 1, true).subscribe(
      (data) => {
        if (data) {
          this.contestList = data
        }
      },
      (error) => {
        this.check = true
      }
    )
    this.contestService.countContestList(false).subscribe(
      (data) => {
        if (data) {
          this.total1 = data['total']
        }
      }, (error) => {
        this.check = true
      }
    )
    this.contestService.getContestList(this.pageIndex1 - 1, false).subscribe(
      (data) => {
        if (data) {
          this.contestFuture = data
        }
      },
      (error) => {
        this.check = true
      }
    )
    this.dataService.user?.subscribe(
      user => {
        this.user = user
      }
    )
  }

  checkDateTime(endDate: string, endHour: string): boolean {
    const endTime = new Date(`${endDate}T${endHour}:00`).getTime();
    const now = new Date().getTime();

    let different = now - endTime;
    if (different > 0) {
      return false
    }
    return true
  }

  redirectLandingPage(contestId: string) {
    this.router.navigate(['landing', contestId])
  }

  signup(index: number) {
    for (let i = 0; i < this.contestFuture[index].signups.length; i++) {
      if (this.contestFuture[index].signups[i].email === this.user.email) {
        this.toastrService.success(
          'Bạn đã đăng ký contest này, hãy đợi duyệt!', '', { timeOut: 2000 }
        )
        return
      }
    }
    this.contestFuture[index].signups.push({ email: this.user.email, status: 'signedUp' })
    this.contestService.update(this.contestFuture[index]).subscribe(
      () => {
        this.toastrService.success(
          'Đã đăng ký, hãy đợi duyệt!', '', { timeOut: 2000 }
        )
      }
    )
  }

  isParticipant(index: number): boolean {
    for (let i = 0; i < this.contestFuture[index].participants.length; i++) {
      if (this.contestFuture[index].participants[i].email === this.user.email) {
        return true
      }
    }
    return false
  }

  checkSignUp(index: number): boolean {
    for (let i = 0; i < this.contestFuture[index].signups.length; i++) {
      if (this.contestFuture[index].signups[i].email === this.user.email) {
        return true
      }
    }
    return false
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.router.navigate(['contests'], { queryParams: { page: event } })
  }

  onPageIndex1Change(event: number) {
    this.pageIndex1 = event
    this.router.navigate(['contests'], { queryParams: { page1: event } })
  }
}
