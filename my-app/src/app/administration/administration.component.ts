import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../api/problem/problem.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data/data.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [MatIconModule, CommonModule, NzPaginationModule, NzModalModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent {
  problems: { id: string, title: string, state: string }[] = []
  check: boolean = true

  pageIndex = 1
  pageSize = 10
  total = 0

  isVisible = false
  id: string = ''
  index: number = -1
  textOk = 'Ok'
  textCancel = 'Đóng'
  constructor(
    private router: Router,
    private problemService: ProblemService,
    private toastrService: ToastrService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.dataService.user?.subscribe(
      user => {
        if (user.role!.code === 'STUDENT') {
          this.check = false
          return
        }
      }
    )
    if (!this.check) return

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.pageIndex = params['page']
        this.problemService.getProblemByCreator(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.problems = data
            }
          },
          (error) => {
            this.toastrService.error(
              'Đã có lỗi xảy ra !', '', { timeOut: 2000 }
            )
          }
        )
        return
      }
    })

    this.problemService.countProblemByCreator().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      }
    )
    this.problemService.getProblemByCreator(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.problems = data
        }
      },
      (error) => {
        this.toastrService.error(
          'Đã có lỗi xảy ra !', '', { timeOut: 2000 }
        )
      }
    )
  }

  createNew() {
    this.router.navigate(['administration', 'create-problem'])
  }

  edit(id: string) {
    this.router.navigate(['administration', 'edit-problem', id])
  }

  updateState(id: string) {
    this.problemService.updateState(id).subscribe(
      () => {
        for (let i = 0; i < this.problems.length; i++) {
          if (this.problems[i].id === id) {
            this.problems[i].state = "PUBLIC"
            break
          }
        }
      },
      (error) => {
        this.toastrService.error(
          `Đã có lỗi xảy ra: ${error.status}`
        )
      }
    )
  }

  redirect(id: string) {
    this.router.navigate(['problems', id]);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk() {
    this.problems.splice(this.index, 1)
    this.problemService.delete(this.id).subscribe(
      (data) => {
        if (data) {
          if (data['result'] === 'success') {
            this.toastrService.success(
              'Xóa thành công!', '', { timeOut: 2000 }
            )
            this.problems.splice(this.index)
          }
        }
        else {
          this.toastrService.success(
            'Bạn không có quyền xóa!', '', { timeOut: 2000 }
          )
        }
      },
      (error) => {
        this.toastrService.error(
          `Đã có lỗi xảy ra, hãy thử lại`, '', { timeOut: 2000 }
        )
      }
    )
  }


  delete(id: string, index: number) {
    this.isVisible = true
    this.id = id
    this.index = index
  }

  onPageIndexChange(event: number) {
    this.router.navigate(['administration'], { queryParams: { page: event } })
  }
}
