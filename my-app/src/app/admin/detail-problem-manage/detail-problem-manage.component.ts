import { Component } from '@angular/core';
import { ProblemService } from '../../api/problem/problem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SubmissionService } from '../../api/submission/submission.service';
import { DataService } from '../../service/data/data.service';

@Component({
  selector: 'app-detail-problem-manage',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  templateUrl: './detail-problem-manage.component.html',
  styleUrl: './detail-problem-manage.component.scss'
})
export class DetailProblemManageComponent {
  problem: any
  statistic: any
  topics: any
  check = false
  isVisible = false
  isVisible1 = false
  textOk = 'Đồng ý'
  textCancel = 'Không'
  constructor(
    private problemService: ProblemService,
    private submissionService: SubmissionService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
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
    this.activatedRoute.params.subscribe(params => {
      if (params['problemId']) {
        this.problemService.getDetailProblem(params['problemId']).subscribe(
          (data) => {
            if (data) {
              this.problem = data['problem']
              this.statistic = data['statistic']
              this.topics = data['topics']
            }
          },
          () => {
            this.check = true
          }
        )
      }
    })
  }

  showModal(i: number): void {
    if (i === 0)
      this.isVisible = true;
    else
      this.isVisible1 = true
  }

  handleOk(): void {
    let ok = false
    this.problemService.delete(this.problem.id).subscribe(
      (data) => {
        if (data['result'] === 'success') {
          ok = true
          this.toastrService.success(
            'Xóa thành công !', '', { timeOut: 2000 }
          )
        }
        else {
          this.toastrService.info(
            'Không thể xóa !', '', { timeOut: 2000 }
          )
        }
      },
      (error) => {
        this.toastrService.error(
          'Đã có lỗi xảy ra, hãy thử lại !', '', { timeOut: 2000 }
        )
      }
    )
    if (ok) {
      setTimeout(() => {
        this.location.back()
      }, 1000)
    }
    this.isVisible = false;
  }

  handleOk1() {
    this.submissionService.deleteSubmissionsNotAC(this.problem.id).subscribe(
      (data) => {
        if (data['result'] === 'success') {
          this.toastrService.success(
            'Đã xóa các Submissions không AC !', '', { timeOut: 2000 }
          )
        }
        else {
          this.toastrService.info(
            'Không thể xóa !', '', { timeOut: 2000 }
          )
        }
      },
      (error) => {
        this.toastrService.error(
          'Đã có lỗi xảy ra, hãy thử lại !', '', { timeOut: 2000 }
        )
      }
    )
    this.isVisible1 = false
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible1 = false;
  }

  goBack() {
    this.location.back()
  }

  redirect(type: string) {
    if (type === 'problem') {
      this.router.navigate(['problems', this.problem.id])
    }
    else {
      this.router.navigate(['problems', this.problem.id, 'all-submissions'])
    }
  }

  handleTopics() {
    let str = ''
    for (let i = 0; i < this.topics.length; i++) {
      str += this.topics[i].name
      if (i != this.topics.length - 1) str += ', '
      else str += '.'
    }
    return str
  }

  handleFolder() {
    let folder = this.problem.testcase[0].input.split('\\')
    return folder[2]
  }
}
