import { Component } from '@angular/core';
import { ContestService } from '../../api/contest/contest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest } from '../../models/contest.model';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-history-contest',
  standalone: true,
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './history-contest.component.html',
  styleUrl: './history-contest.component.scss'
})
export class HistoryContestComponent {

  contests: Contest[] = []
  check: boolean = false

  //pagination
  pageIndex = 1
  pageSize = 10
  total = 0

  constructor(
    private contestService: ContestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.contestService.getHistoryContest(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.contests = data
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })
    this.contestService.countHistoryContest().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      },
      () => {
        this.check = true
      }
    )
    this.contestService.getHistoryContest(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.contests = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.router.navigate(['history-contest'], { queryParams: { page: event } })
  }

  redirect(contestId: string) {
    this.router.navigate(['contests', contestId, 'leaderboard', 'all'])
  }
}
