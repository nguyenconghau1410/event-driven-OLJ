import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContestService } from '../../api/contest/contest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../api/user/user.service';
import { User } from '../../models/user.model';
import { Contest } from '../../models/contest.model';
import { DataService } from '../../service/data/data.service';

@Component({
  selector: 'app-detail-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-rating.component.html',
  styleUrl: './detail-rating.component.scss'
})
export class DetailRatingComponent {
  error: boolean = false
  user!: User

  leaderboardList: any[] = []
  contest!: Contest
  constructor(
    private contestService: ContestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] && params['userId']) {
        this.userService.getUserById(params['userId']).subscribe(
          (data) => {
            if (data) {
              this.user = data
            }
          },
          (error) => {
            this.error = true
          }
        )
        this.contestService.getDetailLeaderboard(params['id'], params['userId']).subscribe(
          (data) => {
            if (data) {
              this.leaderboardList = data
              console.log(this.leaderboardList)
            }
          },
          (error) => {
            this.error = true
          }
        )
        this.contestService.getContest(params['id']).subscribe(
          (data) => {
            if (data) {
              this.contest = data
            }
          }
        )
      }
    })

  }

  formatDate(date: string): string {
    const startDate = new Date(`${this.contest.startTime}T${this.contest.hourStart}:00`).getTime();
    // const endDate = new Date(`${this.contest.endTime}T${this.contest.hourEnd}:00`).getTime();
    const dateT = new Date(date).getTime();
    let duration = '###';
    let difference = dateT - startDate;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      duration = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return duration
  }

  formatNumber(num: number) {
    return parseFloat(num.toFixed(2))
  }

  redirect(submissionId: string) {
    this.router.navigate(['contests', submissionId])
  }

  redirectContest(contestId: string) {
    this.router.navigate(['contests', contestId, 'challenges'])
  }

  check(): boolean {
    let ok = true
    this.dataService.user?.subscribe(
      user => {
        if (user.role?.code === 'STUDENT') {
          if (user.id !== this.user.id) {
            ok = false
          }
        }
      }
    )
    return ok
  }
}
