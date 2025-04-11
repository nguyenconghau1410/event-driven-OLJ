import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContestService } from '../../api/contest/contest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../service/data/data.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-leader-board',
  standalone: true,
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './leader-board.component.html',
  styleUrl: './leader-board.component.scss'
})
export class LeaderBoardComponent {
  leaderBoardList: any[] = []
  topRating: any
  contestId: string = ''
  user!: User
  error = ''
  //pagination
  pageIndex = 1
  pageSize = 30
  total = 0
  constructor(
    private contestService: ContestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.contestId = params['id']
        this.contestService.getTopRating(params['id']).subscribe(
          (data) => {
            if (data) {
              this.topRating = data
            }
          },
          (error) => {
            this.error = "Error"
          }
        )
        this.contestService.countLeaderBoard(params['id']).subscribe(
          (data) => {
            if (data) {
              this.total = data['total']
            }
          },
          (error) => {
            this.error = "Error"
          }
        )
        this.contestService.getLeaderBoardList(params['id'], this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.leaderBoardList = data
            }
          },
          (error) => {
            this.error = "Error"
          }
        )
        this.dataService.user?.subscribe(
          user => {
            this.user = user
          }
        )
      }
    })
  }

  redirect(userId: string) {
    this.router.navigate(['contests', this.contestId, 'leaderboard', userId])
  }

  mySelf(userId: string): boolean {
    if (this.user.id === userId)
      return true
    return false
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.contestService.getLeaderBoardList(this.contestId, event - 1).subscribe(
      (data) => {
        if (data) {
          this.leaderBoardList = data
        }
      },
      (error) => {
        this.toastrService.error(
          "Đã có lỗi xảy ra", '', { timeOut: 2000 }
        )
      }
    )
  }
}
