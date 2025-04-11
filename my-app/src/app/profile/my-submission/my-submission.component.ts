import { Component } from '@angular/core';
import { Submission } from '../../models/submission.model';
import { SubmissionService } from '../../api/submission/submission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-my-submission',
  standalone: true,
  imports: [CommonModule, MatIconModule, NzPaginationModule],
  templateUrl: './my-submission.component.html',
  styleUrl: './my-submission.component.scss'
})
export class MySubmissionComponent {
  submissionList: Submission[] = []
  total = 0
  index = 1
  pageSize = 10

  error: boolean = false
  constructor(
    private submissionService: SubmissionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.index = params['page']
        this.submissionService.getMySubmission(this.index - 1).subscribe(
          (data) => {
            if (data) {
              this.submissionList = data
            }
          },
          (error) => {
            this.error = true
          }
        )
        return
      }
    })
    this.submissionService.countMySubmission().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
          console.log(this.total)
          console.log(data['total'])
        }
      },
      (error) => {
        this.error = true
      }
    )
    this.submissionService.getMySubmission(this.index - 1).subscribe(
      (data) => {
        if (data) {
          this.submissionList = data
        }
      },
      (error) => {
        this.error = true
      }
    )

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
    if (this.adjustingString(x) === 'TLE' || this.adjustingString(x) === 'CE') {
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
    this.router.navigate(['submissions', id])
  }

  onPageIndexChange(event: number) {
    this.router.navigate(['my-submission'], { queryParams: { page: event } })
  }
}
