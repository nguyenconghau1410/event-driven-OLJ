import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService } from '../api/contest/contest.service';
import { Contest } from '../models/contest.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DataService } from '../service/data/data.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-my-contest',
  standalone: true,
  imports: [MatIconModule, CommonModule, NzPaginationModule],
  templateUrl: './my-contest.component.html',
  styleUrl: './my-contest.component.scss'
})
export class MyContestComponent {
  contests: Contest[] = []
  createdBy: String = ''

  pageIndex = 1
  pageSize = 10
  total = 0
  constructor(
    private router: Router,
    private contestService: ContestService,
    private toastrService: ToastrService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.contestService.countContest().subscribe(
      (data) => {
        this.total = data['total']
      }
    )
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.pageIndex = params['page']
        this.contestService.getOne(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.contests = data
            }
          },
          (error) => {
            this.toastrService.error(
              `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
            )
          }
        )
        return
      }
    })
    this.contestService.getOne(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.contests = data
        }
      },
      (error) => {
        this.toastrService.error(
          `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
        )
      }
    )
    this.getName()
  }


  getName() {
    this.dataService.user?.subscribe(
      user => {
        this.createdBy = user.name
      }
    )
  }

  redirectEditComponent(id: string) {
    this.router.navigate(['my-contest', 'edit-contest', id])
  }

  createNew() {
    this.router.navigate(['my-contest', 'create-contest'])
  }

  onPageIndexChange(event: number) {
    this.router.navigate(['my-contest'], { queryParams: { page: event } })
  }
}
