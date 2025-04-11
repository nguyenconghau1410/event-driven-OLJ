import { Component } from '@angular/core';
import { Submission } from '../../models/submission.model';
import { User } from '../../models/user.model';
import { SubmissionService } from '../../api/submission/submission.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { DataService } from '../../service/data/data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-my-submission-problem',
  standalone: true,
  imports: [CommonModule, MatIconModule, NzPaginationModule],
  templateUrl: './my-submission-problem.component.html',
  styleUrl: './my-submission-problem.component.scss'
})
export class MySubmissionProblemComponent {
  submissionList: Submission[] = []
  user!: User
  problemId!: string
  segment!: string
  title = ""
  total = 0
  index = 1
  constructor(
    private submissionService: SubmissionService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.checkForMySubmission()
    this.dataService.user?.subscribe(
      user => {
        this.user = user
      }
    )
  }

  checkForMySubmission() {
    this.activatedRoute.url.subscribe((segments: UrlSegment[]) => {
      const hasAllSubmission = segments.some(segment => segment.path === 'all-submissions');
      const hasMySubmission = segments.some(segment => segment.path === 'my-submissions');
      if (hasMySubmission) {
        this.title = "Danh sách bài nộp"
        this.segment = 'my-submissions'
        this.activatedRoute.params.subscribe(params => {
          if (params['problemId']) {
            this.problemId = params['problemId']
            this.submissionService.countSubmissionProblem(params['problemId'], 'my-submissions').subscribe(
              (data) => {
                this.total = data['total']
              }
            )
          }
        })
        this.activatedRoute.queryParams.subscribe(params => {
          let page = 1
          if (params['page']) {
            page = params['page']
            this.index = params['page']
          }
          this.submissionService.getSubmissionOfProblem(this.problemId, page - 1).subscribe(
            (data) => {
              if (data) {
                this.submissionList = data
              }
            },
            (error) => {
              this.toastrService.error(
                `Đã có lỗi xảy ra: ${error.status}`
              )
            }
          )
        })
      }
      else if (hasAllSubmission) {
        this.title = "Bài nộp của người khác"
        this.segment = 'all-submissions'
        this.activatedRoute.params.subscribe(params => {
          if (params['problemId']) {
            this.problemId = params['problemId']
            this.submissionService.countSubmissionProblem(params['problemId'], 'all-submissions').subscribe(
              (data) => {
                this.total = data['total']
              }
            )
            this.activatedRoute.queryParams.subscribe(params => {
              let page = 1
              if (params['page']) {
                page = params['page']
                this.index = params['page']
              }
              this.submissionService.getSubmissionByProblem(this.problemId, page - 1).subscribe(
                (data) => {
                  if (data) {
                    this.submissionList = data
                  }
                },
                (error) => {
                  this.toastrService.error(
                    `Đã có lỗi xảy ra: ${error.status}`
                  )
                }
              )
            })
          }
        })
      }
    });
  }

  adjustingString(result: string) {
    if (result === 'ACCEPTED') {
      return "AC"
    }
    else if (result === 'WRONG ANSWER') {
      return "WA"
    }
    else if (result === 'RUNTIME ERROR') {
      return "RE"
    }
    else if (result === 'TIME LIMIT EXCEEDED') {
      return "TLE"
    }
    else if (result == 'COMPILATION ERROR') {
      return "CE"
    }
    return ""
  }

  check(x: string): boolean {
    if (!x) return false
    if (this.adjustingString(x) === 'TLE' || this.adjustingString(x) === 'CE') {
      return false
    }
    return true
  }

  checkVisible(userId: string): boolean {
    if (this.user.role?.code !== 'STUDENT') {
      return true
    }
    if (this.user.id !== userId) {
      return false
    }
    return true
  }

  redirect(id: string) {
    this.router.navigate(['problems', id])
  }

  formatNumber(num: number) {
    return parseFloat(num.toFixed(2))
  }

  normalizeString(language: string): string {
    if (language === 'java')
      return "Java"
    else if (language === 'python')
      return "Python"
    else if (language === 'php')
      return "PHP 8"
    else if (language === 'cpp')
      return "C++"
    else
      return "C"
  }

  click(id: string) {
    if (this.user.role!.code !== 'USER') {
      this.router.navigate(['submissions', id])
    }
  }

  onPageIndexChange(event: number) {
    this.router.navigate(['problems', this.problemId, this.segment], { queryParams: { page: event } })
  }
}
