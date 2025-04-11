import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService } from '../../api/contest/contest.service';
import { DataService } from '../../service/data/data.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-contest-manage',
  standalone: true,
  imports: [MatIconModule, CommonModule, NzPaginationModule],
  templateUrl: './contest-manage.component.html',
  styleUrl: './contest-manage.component.scss'
})
export class ContestManageComponent {
  check: boolean = false
  listData: any
  pageIndex = 1
  pageSize = 12
  total = 0

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contestService: ContestService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.dataService.user?.subscribe(
      user => {
        if (!(user.role!.code === 'ADMIN')) {
          this.check = true
          return
        }
      }
    )
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.contestService.getContestOfCreator(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.listData = data
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })
    this.contestService.countContestOfCreator().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      },
      () => {
        this.check = true
      }
    )
    this.contestService.getContestOfCreator(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.listData = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.router.navigate(['admin', 'contests'], { queryParams: { page: event } })
  }

  redirect(email: string) {
    this.router.navigate(['admin', 'contests', email])
  }
}
