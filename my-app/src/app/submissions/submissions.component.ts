import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionService } from '../api/submission/submission.service';
import { ToastrService } from 'ngx-toastr';
import { Submission } from '../models/submission.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../service/websocket/websocket.service';
import { DataService } from '../service/data/data.service';
import { User } from '../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule, MatIconModule, NzPaginationModule, BaseChartDirective],
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.scss'
})
export class SubmissionsComponent {
  submissionList: Submission[] = []
  user!: User
  total: number = 0
  index = 1
  labels: string[] = []
  data: number[] = []
  public pieChartOptions: ChartOptions = {
    responsive: true
  }

  handleBackgroundColor(labels: string[]) {
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] == 'Error') {
        return [
          'rgb(0, 0, 0)',
          'rgb(0, 255, 0)',
          'rgb(85, 85, 85)',
          'rgb(255, 205, 86)',
          'rgb(200, 200, 200)',
          'rgb(255, 0, 0)'
        ]
      }
    }
    return [
      'rgb(0, 255, 0)',
      'rgb(85, 85, 85)',
      'rgb(255, 205, 86)',
      'rgb(200, 200, 200)',
      'rgb(255, 0, 0)'
    ]
  }

  chartData = {
    labels: this.labels,
    datasets: [
      {
        data: this.data,
        fill: true,
        backgroundColor: this.handleBackgroundColor(this.labels)
      }
    ]
  }

  constructor(
    private submissionService: SubmissionService,
    private toastrService: ToastrService,
    private router: Router,
    private websocketService: WebsocketService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.submissionService.count().subscribe(
      (data) => {
        this.total = data['total']
      }
    )

    this.submissionService.getStatistic().subscribe(
      (data) => {
        if (data) {
          for (let i = 0; i < data.length; i++) {
            if (!data[i]['id']) this.labels.push('Error')
            else this.labels.push(this.adjustingString(data[i]['id']))
            this.data.push(data[i]['quantity'])
          }
        }
      }
    )



    this.activatedRoute.queryParams.subscribe(params => {
      let page = 1
      if (params['page']) {
        this.index = params['page']
        page = params['page']
      }
      this.submissionService.getAll(page - 1).subscribe(
        (data) => {
          if (data) {
            this.submissionList = data
          }
        },
        (error) => {
          this.toastrService.error(
            `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
          )
        }
      )
    })
    let destination = `/user/public/queue/messages`
    this.websocketService.subscribe(destination, (frame: any) => {
      const decoder = new TextDecoder('utf-8');
      const messageText = decoder.decode(frame.binaryBody);
      const message = JSON.parse(messageText);
      this.submissionList.unshift(message)
    })

    this.dataService.user?.subscribe(
      user => {
        this.user = user
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
    if (!x) return false
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
    if (this.user.role!.code !== 'USER') {
      this.router.navigate(['submissions', id])
    }
  }

  onPageIndexChange(event: number) {
    this.router.navigate(['submissions'], { queryParams: { page: event } })
  }
}
