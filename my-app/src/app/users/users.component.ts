import { Component } from '@angular/core';
import { SubmissionService } from '../api/submission/submission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { id_ID } from 'ng-zorro-antd/i18n';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DataService } from '../service/data/data.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  tops: any = []
  total = 0
  pageIndex = 1
  pageSize = 25

  check: boolean = false
  constructor(
    private submissionService: SubmissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.submissionService.getLeaderboardUser(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.tops = data
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })

    this.submissionService.countAllUser().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      },
      () => {
        this.check = true
      }
    )

    this.submissionService.getLeaderboardUser(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.tops = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  redirect(userId: string) {
    this.router.navigate(['users', userId])
  }

  yourself(userId: string): boolean {
    let ok = false
    this.dataService.user?.subscribe(
      user => {
        if (user.id === userId) {
          ok = true
        }
      }
    )
    return ok
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    this.router.navigate(['users'], { queryParams: { page: event } })
  }
}
