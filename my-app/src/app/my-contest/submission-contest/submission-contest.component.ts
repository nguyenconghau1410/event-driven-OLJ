import { Component } from '@angular/core';
import { DetailContest } from '../../models/detail-contest.model';
import { ContestService } from '../../api/contest/contest.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data/data.service';
import { User } from '../../models/user.model';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-submission-contest',
  standalone: true,
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './submission-contest.component.html',
  styleUrl: './submission-contest.component.scss'
})
export class SubmissionContestComponent {
  detailContestList: DetailContest[] = []
  error = ''
  problemId = ''
  contestId = ''
  title = ''
  user!: User
  total = 0
  pageSize = 15
  pageIndex = 1
  type!: string
  constructor(
    private contestService: ContestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.dataService.user?.subscribe(
      user => {
        this.user = user
      }
    )
    this.checkForMySubmission()
  }

  checkForMySubmission() {
    this.activatedRoute.url.subscribe((segments: UrlSegment[]) => {
      const hasAllSubmission = segments.some(segment => segment.path === 'all-submission');
      const hasMySubmission = segments.some(segment => segment.path === 'my-submission');
      if (hasAllSubmission) {
        this.title = "Tất cả submission"
        this.type = 'all'
        this.activatedRoute.params.subscribe(params => {
          const id = params['id']
          this.contestId = id
          if (id) {
            this.contestService.countSubmissionsContest(id, 'empty', 'empty').subscribe(
              (data) => {
                if (data) {
                  this.total = data['count']
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )
            this.contestService.getAllSubmissionOfContest(id, this.pageIndex - 1).subscribe(
              (data) => {
                if (data) {
                  this.detailContestList = data
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )
          }
        })
      }
      else if (hasMySubmission) {
        this.title = "Các bài nộp"
        this.type = 'my-self'
        this.activatedRoute.params.subscribe(params => {
          const id = params['id']
          this.contestId = id
          if (id) {
            this.contestService.countSubmissionsContest(id, this.user.id, 'empty').subscribe(
              (data) => {
                if (data) {
                  this.total = data['count']
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )
            this.contestService.getMySubmissionOfContest(id, this.pageIndex - 1).subscribe(
              (data) => {
                if (data) {
                  this.detailContestList = data
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )
          }
        })
      }
      else {
        this.type = 'others'
        this.activatedRoute.params.subscribe(params => {
          const id = params['id']
          this.contestId = id
          const problemId = params['problemId']
          this.problemId = problemId
          if (id && problemId) {
            this.contestService.countSubmissionsContest(id, 'empty', problemId).subscribe(
              (data) => {
                if (data) {
                  this.total = data['count']
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )

            this.contestService.getSubmissionOfProblemInContest(id, problemId, this.pageIndex - 1).subscribe(
              (data) => {
                if (data) {
                  this.detailContestList = data
                  this.title = `Bài nộp ${this.detailContestList[0].title}`
                }
              },
              (error) => {
                this.error = `Đã có lỗi xảy ra: ${error.status}`
              }
            )
          }
        })
      }
    });
  }

  formatNumber(num: number) {
    return parseFloat(num.toFixed(2))
  }

  normalizeString(language: string): string {
    if (language === 'java')
      return "Java"
    else if (language === 'python')
      return "Python"
    else if (language === 'cpp')
      return "C++"
    else if (language === 'php')
      return "PHP 8"
    else
      return "C"
  }

  viewSubmission(id: string) {
    this.router.navigate(['contests', id])
  }

  check(userId: string): boolean {
    if (this.user.role!.code !== 'STUDENT')
      return true
    let ok = true
    if (this.problemId === '') {
      return true
    }
    if (this.user.id !== userId) {
      ok = false
    }
    return ok
  }


  onPageIndexChange(event: number) {
    this.pageIndex = event
    if (this.type === 'all') {
      this.contestService.getAllSubmissionOfContest(this.contestId, this.pageIndex - 1).subscribe(
        (data) => {
          if (data) {
            this.detailContestList = data
          }
        },
        (error) => {
          this.error = `Đã có lỗi xảy ra: ${error.status}`
        }
      )
    }
    else if (this.type === 'my-self') {
      this.contestService.getMySubmissionOfContest(this.contestId, this.pageIndex - 1).subscribe(
        (data) => {
          if (data) {
            this.detailContestList = data
          }
        },
        (error) => {
          this.error = `Đã có lỗi xảy ra: ${error.status}`
        }
      )
    }
    else {
      this.contestService.getSubmissionOfProblemInContest(this.contestId, this.problemId, this.pageIndex - 1).subscribe(
        (data) => {
          if (data) {
            this.detailContestList = data
            this.title = `Bài nộp ${this.detailContestList[0].title}`
          }
        },
        (error) => {
          this.error = `Đã có lỗi xảy ra: ${error.status}`
        }
      )
    }
  }
}



