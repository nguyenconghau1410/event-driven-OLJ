import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Contest } from '../../models/contest.model';
import { ContestService } from '../../api/contest/contest.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProblemService } from '../../api/problem/problem.service';
import { UserService } from '../../api/user/user.service';
import { User } from '../../models/user.model';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DataService } from '../../service/data/data.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
@Component({
  selector: 'app-detail-contest',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, MatIconModule, NzPaginationModule, BaseChartDirective],
  templateUrl: './detail-contest.component.html',
  styleUrl: './detail-contest.component.scss'
})
export class DetailContestComponent {
  public Editor = Editor
  error: boolean = false
  contest!: Contest
  isChecked: boolean = false
  showAddProblemForm: boolean = false
  domainName = (window as any)?.env?.DOMAIN_NAME && !window.env.DOMAIN_NAME.includes("${")
  ? window.env.DOMAIN_NAME : "http://localhost:4200";
  // for tab
  index = 0
  // for pagination
  page = 1
  pageSize = 20
  total = 0
  // index 1
  problemsSearch: { id: string, title: string, email: string, point: number }[] = []
  problems: { id: string, title: string, email: string, point: number }[] = []
  problem: { id: string, title: string, email: string, point: number } = {
    id: '',
    title: '',
    email: '',
    point: 0
  }
  // index 3
  users: User[] = []
  userSearch: string = ''
  user: User = {
    id: '',
    email: '',
    name: '',
    tag: '',
    avatar: '',
    faculty: '',
    classname: ''
  }
  // index 4
  signups: User[] = []
  // index 2
  selected: string = ''
  content: string = ''
  // index 5
  statisticUser: any
  public pieChartOptions: ChartOptions = {
    responsive: true
  }
  handleBackgroundColor(labels: string[]) {
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] == 'Error') {
        return [
          'rgb(0, 255, 0)',
          'rgb(0, 0, 0)',
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
  labels: string[] = []
  data: number[] = []
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
    private contestService: ContestService,
    private problemService: ProblemService,
    private toastrService: ToastrService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.contestService.getContest(params['id']).subscribe(
          (data) => {
            if (data) {
              this.contest = data
              this.dataService.user?.subscribe(
                user => {
                  if (user.email !== this.contest.createdBy) {
                    this.error = true
                    return
                  }
                }
              )

              if (this.contest.noTime) {
                this.isChecked = true;
              }
            }
          },
          (error) => {
            this.toastrService.error(
              `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
            )
          }
        )
      }
    })
  }

  saveChange(index: number) {
    if (index === 1) {
      let list: { id: string, point: number }[] = []
      for (let i = 0; i < this.problems.length; i++) {
        list.push({ id: this.problems[i].id, point: this.problems[i].point })
      }
      this.contest.problems = list
    }
    this.contestService.update(this.contest).subscribe(
      (data) => {
        this.toastrService.success(
          'Lưu thành công', '',
          { timeOut: 2000 }
        )
      },
      (error) => {
        this.toastrService.info(
          `Đã có lỗi xảy ra, hãy thử lại: ${error.status}`, '',
          { timeOut: 2000 }
        )
      }
    )
  }

  change() {
    this.isChecked = !this.isChecked
  }

  clickTab(index: number) {
    if (index === 4) {
      if (this.contest.mode === 'NRR') {
        this.toastrService.info(
          'Chế độ contest của bạn không phù hợp với chức năng này', '',
          { timeOut: 2000 }
        )
        return
      }
      this.page = 1
      this.total = this.contest.signups ? this.contest.signups.length : 0
      this.contestService.getSignups(this.contest.id, this.page - 1).subscribe(
        (data) => {
          this.signups = data
        }
      )
    }
    else if (index === 1) {
      this.page = 1
      this.total = this.contest.problems ? this.contest.problems.length : 0
      this.contestService.getChallenges(this.contest.id, this.page - 1).subscribe(
        (data) => {
          if (data) {
            this.problems = data
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
    }
    else if (index === 3) {
      this.page = 1
      this.total = this.contest.participants.length
      this.contestService.getParticipants(this.contest.id, this.page - 1).subscribe(
        (data) => {
          if (data) {
            this.users = data
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
    }
    else if (index === 5) {
      this.contestService.getStatisticContest(this.contest.id).subscribe(
        (data) => {
          if (data) {
            this.statisticUser = data
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
      this.contestService.getStatisticListContest(this.contest.id).subscribe(
        (data) => {
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (!data[i]['id']) this.labels.push('Error')
              else this.labels.push(this.adjustingString(data[i]['id']))
              this.data.push(data[i]['quantity'])
            }
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
    }
    this.index = index
  }

  closeForm() {
    this.showAddProblemForm = false
    this.problemsSearch = []
    clearTimeout(this.timeoutId);
  }

  openForm() {
    this.showAddProblemForm = true
  }

  changeState() {
    if (this.contest.state === "PRIVATE") {
      this.contest.state = "PUBLIC"
    }
    else {
      this.contest.state = "PRIVATE"
    }
  }

  private timeoutId: any
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const newValue = inputElement.value

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      if (newValue !== "") {
        this.problemService.getProblemByKeyword(newValue).subscribe(
          (data) => {
            if (data) {
              this.problemsSearch = data
            }
          },
        )
      }
      else {
        this.problemsSearch = []
      }
    }, 300);
  }
  
  onInputChangeUser(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const newValue = inputElement.value
    if (newValue !== "" && newValue.includes("@")) {
      if(newValue.split("@").length === 2 && newValue.split("@")[1].includes(".")) {
        this.userService.getUserEmail(newValue).subscribe(
          (data) => {
            if (data) {
              this.user = data
            }
          },
        )
      }
    }
    else {
      this.user = {
        id: '',
        email: '',
        name: '',
        tag: '',
        avatar: '',
        faculty: '',
        classname: ''
      }
    }
  }

  onPageIndexChange(event: number) {
    if (this.index === 3) {
      this.page = event
      this.contestService.getParticipants(this.contest.id, event - 1).subscribe(
        (data) => {
          if (data) {
            this.users = data
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
    }
    else if (this.index === 4) {
      this.page = event
      this.contestService.getSignups(this.contest.id, event - 1).subscribe(
        (data) => {
          this.signups = data
        }
      )
    }
    else if (this.index === 1) {
      this.page = event
      this.contestService.getChallenges(this.contest.id, this.page - 1).subscribe(
        (data) => {
          if (data) {
            this.problems = data
          }
        },
        (error) => {
          this.toastrService.info(
            `Đã có lỗi xảy ra: ${error.status}`, '',
            { timeOut: 2000 }
          )
        }
      )
    }
  }

  // index 2
  chooseProblem(p: { id: string, title: string, email: string, point: number }) {
    this.problem = p
    this.problemsSearch = []
  }

  addProblem() {
    this.problems.push(this.problem)
    console.log(this.problems)
    this.problem = {
      id: '',
      title: '',
      email: '',
      point: 0
    }
    this.showAddProblemForm = false
  }

  removeTask(i: number) {
    this.problems.splice(i, 1)
  }

  validatePositiveNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (parseFloat(value) < 0) {
      inputElement.value = '';
    }
  }

  // redirect
  redirect(id: string) {
    this.router.navigate(['problems', id])
  }

  redirectLandingPage(contestId: string) {
    this.router.navigate(['landing', contestId])
  }

  redirectChallengesPage(contestId: string) {
    this.router.navigate(['contests', contestId, 'challenges'])
  }

  // index 3
  clickUser() {
    this.userSearch = this.user.email
    this.user.id = ''
    // this.user = {
    //   id: '',
    //   email: '',
    //   name: '',
    //   tag: '',
    //   avatar: '',
    //   faculty: '',
    //   classname: ''
    // }
  }

  addMember() {
    for (let i = 0; i < this.contest.participants.length; i++) {
      if (this.contest.participants[i].email === this.user.email) {
        this.toastrService.info(
          `${this.user.email} đã tồn tại trong danh sách!`, '', { timeOut: 2000 }
        )
        return
      }
    }
    this.userService.getUserEmail(this.user.email).subscribe(
      (data) => {
        if(data) {
          this.contest.participants.push({ email: this.user.email, joined: false })
          this.users.push(this.user)
          this.user = {
            id: '',
            email: '',
            name: '',
            tag: '',
            avatar: '',
            faculty: '',
            classname: ''
          }
          this.contestService.update(this.contest).subscribe(
            (data) => {
              this.toastrService.success(
                'Thêm thành công', '',
                { timeOut: 2000 }
              )
            },
            (error) => {
              this.toastrService.info(
                `Đã có lỗi xảy ra, hãy thử lại: ${error.status}`, '',
                { timeOut: 2000 }
              )
            }
          )
        }
      },
      (error) => {
        this.toastrService.warning(
          `Email không tồn tại!`, '', { timeOut: 2000 }
        )
      }
    )
  }

  handYN(i: number): string {
    return this.contest.participants[i].joined ? "YES" : "NO"
  }

  //index 4

  accepted(index: number) {
    this.contest.signups[index].status = 'Accepted'
    this.contest.participants.push({ email: this.contest.signups[index].email, joined: false })
    this.toastrService.success(
      `Đã chấp nhập`, '', { timeOut: 2000 }
    )
  }

  refuse(index: number) {
    this.contest.signups[index].status = 'Refuse'
    this.toastrService.success(
      `Đã từ chối`, '', { timeOut: 2000 }
    )
  }

  acceptedAll() {
    for (let i = 0; i < this.contest.signups.length; i++) {
      if (this.contest.signups[i].status === 'signedUp') {
        this.contest.signups[i].status = 'Accepted'
        this.contest.participants.push({ email: this.contest.signups[i].email, joined: false })
      }
    }
    this.toastrService.success(
      `Đã chấp nhập tất cả`, '', { timeOut: 2000 }
    )
  }

  refuseAll() {
    for (let i = 0; i < this.contest.signups.length; i++) {
      if (this.contest.signups[i].status === 'signedUp')
        this.contest.signups[i].status = 'Refuse'
    }
    this.toastrService.success(
      `Đã từ chối tất cả`, '', { timeOut: 2000 }
    )
  }

  // index 2
  sendNotification() {
    this.websocketService.sendMessage('/app/notify', { id: this.contest.id, content: this.content })
    this.toastrService.success(
      'Đã gửi thành công', '', { timeOut: 2000 }
    )
  }

  // index 5
  joined(): number {
    let count = 0
    for (let i = 0; i < this.contest.participants.length; i++) {
      if (this.contest.participants[i].joined) {
        ++count
      }
    }
    return count
  }

  signedUp(): number {
    return this.contest.signups ? this.contest.signups.length : 0
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

}
