import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from '../api/user/user.service';
import { User } from '../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CheckStatusService } from '../service/check/check-status.service';
import { SubmissionService } from '../api/submission/submission.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NzIconModule, CommonModule, FormsModule, NzPaginationModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  showEditForm = false
  user!: User | null;
  total!: number
  error: boolean = false
  figure: any

  pageIndex = 1
  totalPage = 0
  pageSize = 10
  acList: any
  index = 0
  constructor(
    private userService: UserService,
    private submissionService: SubmissionService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (data) => {
        if (data != null) {
          this.user = data
        }
      },
      (error) => {
        this.error = true
      }
    )
    this.submissionService.countMySubmission().subscribe(
      (data) => {
        if (data) {
          this.total = data['total'];
        }
      },
      (error) => {
        this.error = true
      }
    )
    this.submissionService.getFigure().subscribe(
      (data) => {
        this.figure = data
      }
    )
  }

  openForm() {
    this.showEditForm = true
  }

  closeForm() {
    this.showEditForm = false
  }

  onSubmit(form: NgForm) {
    this.userService.updateUser(form.value).subscribe(
      (data) => {
        this.toastr.success('Lưu thành công', '', {
          timeOut: 1000,
        })
        this.showEditForm = false
        this.user!.name = form.value.name
        this.user!.faculty = form.value.faculty
        this.user!.classname = form.value.classname
      },
      (error) => {
        this.toastr.error(
          'Đã có lỗi xảy ra, hãy thử lại!', '', { timeOut: 2000 }
        )
      }
    )
  }

  changeTab(i: number) {
    if (i === 0) {
      this.index = 0
    }
    else {
      this.index = 1
      this.submissionService.countACList(this.user!.id).subscribe(
        (data) => {
          this.total = data['total']
        }
      )
      this.submissionService.getACList(this.user!.id, this.pageIndex - 1).subscribe(
        (data) => {
          this.acList = data
        }
      )
    }
  }

  fixed(data: number) {
    return data.toFixed(2)
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.submissionService.getACList(this.user!.id, this.pageIndex - 1).subscribe(
      (data) => {
        this.acList = data
      }
    )
  }

  viewSubmission(id: string) {
    this.router.navigate(['submissions', id])
  }

  topUser(top: number) {
    if (top === -1)
      return '###'
    return top + 1
  }
}
