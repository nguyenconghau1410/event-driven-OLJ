import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ContestService } from '../../api/contest/contest.service';
import { DataService } from '../../service/data/data.service';
import { MatIconModule } from '@angular/material/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-contest-creator',
  standalone: true,
  imports: [CommonModule, NzPaginationModule, MatIconModule, NzModalModule],
  templateUrl: './detail-contest-creator.component.html',
  styleUrl: './detail-contest-creator.component.scss'
})
export class DetailContestCreatorComponent {
  check: boolean = false
  dataList: any
  total = 0
  pageIndex = 1
  pageSize = 12
  email: string = ''
  isVisible = false
  index = -1
  textOk = 'Đồng ý'
  textCancel = 'Không'
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.dataService.user?.subscribe(
      user => {
        if (!(user.role!.code === 'ADMIN')) {
          this.check = true
          return
        }
      }
    )
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page']) {
        this.contestService.getContestsCreator(this.email, this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.dataList = data
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })
    this.activatedRoute.params.subscribe(params => {
      if (params['userId']) {
        this.email = params['userId']
        this.contestService.countContestsCreator(this.email).subscribe(
          (data) => {
            if (data) {
              this.total = data['total']
            }
          },
          () => {
            this.check = true
          }
        )
        this.contestService.getContestsCreator(this.email, this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.dataList = data
            }
          },
          () => {
            this.check = true
          }
        )
      }
    })
  }

  onPageIndexChange(event: number) {
    this.index = event
    this.router.navigate(['admin', 'contests', this.email], { queryParams: { page: event } })
  }

  showModal(i: number): void {
    this.index = i
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.index !== -1) {
      this.contestService.deleteContest(this.dataList[this.index].contest.id).subscribe(
        (data) => {
          if (data['result'] === 'success') {
            this.toastrService.success(
              "Xóa thành công !", '', { timeOut: 2000 }
            )
            this.dataList.splice(this.index, 1)
          }
          else {
            this.toastrService.info(
              "Bạn không có quyền để xóa !", '', { timeOut: 2000 }
            )
          }
        },
        () => {
          this.toastrService.error(
            "Đã có lỗi xảy ra, hãy thử lại sau !", '', { timeOut: 2000 }
          )
        }
      )
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  redirect(contestId: string) {
    this.router.navigate(['landing', contestId])
  }

  goBack() {
    this.location.back()
  }
}
