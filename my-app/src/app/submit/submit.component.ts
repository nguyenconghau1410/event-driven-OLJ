import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { Problem } from '../models/problem.model';
import { ProblemService } from '../api/problem/problem.service';
import { CheckStatusService } from '../service/check/check-status.service';
import { SubmissionService } from '../api/submission/submission.service';
import { Submit } from '../models/submit.model';
import { ContestService } from '../api/contest/contest.service';
import { Contest } from '../models/contest.model';
import { da_DK } from 'ng-zorro-antd/i18n';
import { ToastrService } from 'ngx-toastr';
const mode = {
  'text/x-c++src':
    `#include <bits/stdc++.h>

using namespace std;
  
int main() {
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);
      
  return 0;
}`,
  'text/x-php': '',
  'text/x-python': '',
  'text/x-java': `import java.io.*;
import java.util.*;
  
public class Main {
  public static void main(String[] args) {
  
  }
}`
}

@Component({
  selector: 'app-submit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CodemirrorModule],
  templateUrl: './submit.component.html',
  styleUrl: './submit.component.scss'
})
export class SubmitComponent {
  code = mode['text/x-c++src']
  language: string = 'text/x-c++src'
  languageMode: string = 'cpp'
  options = {
    lineNumbers: true,
    theme: 'default',
    mode: this.language,
  };
  problem!: Problem
  submitModel: Submit = {
    problem: undefined,
    contest: undefined,
    code: '',
    language: '',
    timeLimit: 0,
    memoryLimit: 0
  }
  contestId?: string | null
  contest?: Contest
  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private status: CheckStatusService,
    private contestService: ContestService,
    private submissiontService: SubmissionService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.route.paramMap.subscribe(params => {
      const id = params.get('problemId')
      this.contestId = params.get('id')
      if (id) {
        this.problemService.getProblem(id).subscribe(
          (data) => {
            this.problem = data
          },
          (error) => {
            this.status.checkStatusCode(error.status)
          }
        )
      }
      if (this.contestId) {
        this.contestService.getContest(this.contestId).subscribe(
          (data) => {
            if (data) {
              this.contest = data
            }
          }
        )
      }
    })
  }

  onChange() {
    if (this.languageMode === 'cpp') {
      this.code = mode['text/x-c++src']
      this.language = 'text/x-c++src'
    }
    else if (this.languageMode === 'java') {
      this.code = mode['text/x-java']
      this.language = 'text/x-java'
    }
    else if (this.languageMode === 'python') {
      this.code = mode['text/x-python']
      this.language = 'text/x-python'
    }
    else if (this.languageMode === 'php') {
      this.code = mode['text/x-php']
      this.language = 'text/x-php'
    }
  }

  submit() {
    this.submitModel.code = this.code
    this.submitModel.language = this.languageMode
    this.submitModel.problem = this.problem
    this.submitModel.contest = this.contest
    this.submitModel.timeLimit = parseFloat(this.problem.timeLimit)
    this.submitModel.memoryLimit = parseInt(this.problem.memoryLimit)
    if (this.contestId && this.contest) {
      this.contestService.addSubmission(this.submitModel).subscribe(
        (data) => {
          if (data) {
            this.router.navigate(['contests', data['id']])
          }
        },
        (error) => {
          this.toastrService.error(
            `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
          )
        }
      )
    }
    else {
      this.submissiontService.submit(this.submitModel).subscribe(
        (data) => {
          if (data) {
            this.router.navigate(['submissions', data['id']])
          }
        },
        (error) => {
          this.status.checkStatusCode(error.status)
        }
      )
    }
  }
}
