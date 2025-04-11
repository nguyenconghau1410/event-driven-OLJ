import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SubmissionService } from '../api/submission/submission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Submission } from '../models/submission.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { WebsocketService } from '../service/websocket/websocket.service';
import { ResultTest } from '../models/result-test.model';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data/data.service';
import { User } from '../models/user.model'
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CodemirrorModule, CommonModule, FormsModule, NzIconModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  submission!: Submission
  user!: User
  code: string = ""
  options = {}
  completed = false
  resultList: ResultTest[] = []
  constructor(
    private submissionService: SubmissionService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.dataService.user?.subscribe(
      user => {
        this.user = user
      }
    )

    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.submissionService.getSubmission(id).subscribe(
          (data) => {
            if (data) {
              this.submission = data

              if (this.user.role!.code === 'STUDENT' && this.user.id !== this.submission.userId) {
                this.router.navigate(['problems', this.submission.problemId])
                return
              }

              this.code = this.submission.source
              if (this.submission.language === "java") {
                this.options = {
                  lineNumbers: true,
                  theme: 'default',
                  mode: 'text/x-java',
                }
              }
              else if (this.submission.language === 'python') {
                this.options = {
                  lineNumbers: true,
                  theme: 'default',
                  mode: 'text/x-python',
                }
              }
              else if (this.submission.language === 'cpp') {
                this.options = {
                  lineNumbers: true,
                  theme: 'default',
                  mode: 'text/x-c++src',
                }
              }
              else if (this.submission.language === 'php') {
                this.options = {
                  lineNumbers: true,
                  theme: 'default',
                  mode: 'text/x-php',
                }
              }
              else {
                this.options = {
                  lineNumbers: true,
                  theme: 'default',
                  mode: 'text/x-csrc',
                }
              }

              if (!this.submission.result) {
                //send id
                this.websocketService.sendMessage('/app/execute', id)

                // listen websocket
                let destination = `/user/${this.submission.id}/queue/messages`
                this.websocketService.subscribe(destination, (frame: any) => {
                  const decoder = new TextDecoder('utf-8');
                  const messageText = decoder.decode(frame.binaryBody);
                  const message = JSON.parse(messageText);
                  
                  this.submission = message['data'];
                  this.resultList = this.submission.testcases
                  this.cdr.detectChanges();
                  this.websocketService.sendMessage('/app/submission', id)
                })

              }
              else {
                this.resultList = this.submission.testcases
              }
            }
          },
          (error) => {
            this.toastrService.info(
              'Không tìm thấy dữ liệu!', '', { timeOut: 2000 }
            )
          }
        )
      }
    })
  }

  formatNumber(num: number) {
    return parseFloat(num.toFixed(2))
  }

  check(result: string): boolean {
    if (result === 'TIME LIMIT EXCEEDED') {
      return false
    }
    return true
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

}
