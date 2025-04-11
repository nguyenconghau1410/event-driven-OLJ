import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../api/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data/data.service';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [MatIconModule, CommonModule, NzModalModule, NzPaginationModule, FormsModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss'
})
export class UserManageComponent {
  check: boolean = false
  total = 0
  pageIndex = 1
  pageSize = 12
  users: any
  index = -1
  isVisible = false
  isVisible1 = false
  textOk = 'Đồng ý'
  textCancel = 'Không'
  data = {
    email: '',
    code: ''
  }
  searchFor = ''
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastrService: ToastrService
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
      if (params['search']) {
        this.searchFor = params['search']
        this.userService.search(params['search'], this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.users = data['list']
              this.total = data['total']
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
      else if (params['search'] && params['page']) {
        this.searchFor = params['search']
        this.userService.search(params['search'], this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.users = data['list']
              this.total = data['total']
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }

      if (params['page']) {
        this.userService.getAllUsers(this.pageIndex - 1).subscribe(
          (data) => {
            if (data) {
              this.users = data
            }
          },
          () => {
            this.check = true
          }
        )
        return
      }
    })
    this.userService.countAllUsers().subscribe(
      (data) => {
        if (data) {
          this.total = data['total']
        }
      },
      () => {
        this.check = true
      }
    )
    this.userService.getAllUsers(this.pageIndex - 1).subscribe(
      (data) => {
        if (data) {
          this.users = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  redirect(id: string) {
    this.router.navigate(['users', id])
  }

  onPageIndexChange(event: number) {
    this.pageIndex = event
    if (this.searchFor != '') {
      this.router.navigate(['admin', 'members'], { queryParams: { page: event, search: this.searchFor } })
      return
    }
    this.router.navigate(['admin', 'members'], { queryParams: { page: event } })
  }

  showModal(i: number): void {
    this.index = i
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.index !== -1) {
      this.userService.deleteUser(this.users[this.index].id).subscribe(
        (data) => {
          if (data['result'] === 'success') {
            this.toastrService.success(
              'Xóa thành công !', '', { timeOut: 2000 }
            )
            this.users.splice(this.index, 1)
          }
          else {
            this.toastrService.error(
              'Bạn không có quyền để xóa !', '', { timeOut: 2000 }
            )
          }
        },
        () => {
          this.toastrService.error(
            'Đã có lỗi xảy ra !', '', { timeOut: 2000 }
          )
        }
      )
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible1 = false;
  }

  handleDate(date: string) {
    const d = new Date(date)
    const day = d.getDate();
    const month = d.getMonth() + 1; // getMonth() trả về giá trị từ 0 đến 11
    const year = d.getFullYear();

    // Lấy giờ
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`
  }

  showModal1(): void {
    if (!this.data.email && !this.data.code) {
      this.toastrService.info(
        `Hãy điền các thông tin !`, '', { timeOut: 2000 }
      )
      return
    }
    this.isVisible1 = true;
  }

  handleOk1(): void {
    this.userService.exchangeRole(this.data).subscribe(
      (data) => {
        if (data['result'] === 'success') {
          this.toastrService.success(
            'Lưu thành công !', '', { timeOut: 2000 }
          )
        }
        else if (data['result'] === 'error') {
          this.toastrService.info(
            'Không thể xóa !', '', { timeOut: 2000 }
          )
        }
        else {
          this.toastrService.info(
            'Email không tồn tại !', '', { timeOut: 2000 }
          )
        }
      },
      (error) => {
        this.toastrService.error(
          `Đã có lỗi xảy ra, hãy thử lại: ${error.status}`, '', { timeOut: 2000 }
        )
      }
    )
    this.isVisible1 = false;
  }

  search() {
    if (this.searchFor === '') {
      this.toastrService.info(
        'Hãy nhập keyword cần tìm kiếm !', '', { timeOut: 2000 }
      )
      return
    }
    this.router.navigate(['admin', 'members'], { queryParams: { search: this.searchFor } })
  }
  reset() {
    window.location.href = "/admin/members"
  }
}
