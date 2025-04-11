import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProblemService } from '../../api/problem/problem.service';
import { DataService } from '../../service/data/data.service';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-problem-manage',
  standalone: true,
  imports: [CommonModule, NzPaginationModule, FormsModule],
  templateUrl: './problem-manage.component.html',
  styleUrl: './problem-manage.component.scss'
})
export class ProblemManageComponent {
  check: boolean = false;
  total = 0
  pageIndex = 1
  pageSize = 12
  problems: any

  searchFor = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private problemService: ProblemService,
    private dataService: DataService,
    private toastrService: ToastrService
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
      if (params['search']) {
        this.searchFor = params['search']
        this.problemService.getSearchAdmin(this.searchFor, this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.problems = data['list']
              this.total = data['total']
            }
          },
          () => {

            this.check = true
          }
        )
        return
      }
      else if (params['search'] && params['page']) {
        this.searchFor = params['search']
        this.problemService.getSearchAdmin(this.searchFor, this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.problems = data['list']
              this.total = data['total']
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
      if (params['page']) {
        this.problemService.getAll(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.problems = data
              console.log(this.problems)
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })

    this.problemService.countAll().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      },
      () => {
        this.check = true
      }
    )

    this.problemService.getAll(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.problems = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    if (this.searchFor !== '') {
      this.router.navigate(['admin', 'problems'], { queryParams: { page: event, search: this.searchFor } })
      return
    }
    this.router.navigate(['admin', 'problems'], { queryParams: { page: event } })
  }

  redirect(problemId: string) {
    this.router.navigate(['admin', 'problems', problemId])
  }

  search() {
    if (this.searchFor === '') {
      this.toastrService.info(
        'Hãy nhập keyword cần tìm kiếm !', '', { timeOut: 2000 }
      )
      return
    }
    this.router.navigate(['admin', 'problems'], { queryParams: { search: this.searchFor } })
  }

  reset() {
    window.location.href = "/admin/problems"
  }
}
