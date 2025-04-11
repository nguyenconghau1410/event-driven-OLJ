import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../service/data/data.service';
import { FileService } from '../../api/file/file.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-testcase-manage',
  standalone: true,
  imports: [CommonModule, MatIconModule, NzModalModule],
  templateUrl: './testcase-manage.component.html',
  styleUrl: './testcase-manage.component.scss'
})
export class TestcaseManageComponent {
  check = false
  folders: any
  isVisible = false
  textOk = 'Đồng ý'
  textCancel = 'Không'
  index = -1
  constructor(
    private dataService: DataService,
    private fileService: FileService,
    private toastrService: ToastrService,
    private router: Router
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
    this.fileService.getFolder().subscribe(
      (data) => {
        if (data) {
          this.folders = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  showModal(i: number): void {
    this.index = i
    this.isVisible = true;
  }
  handleOk(): void {
    if (this.index !== -1) {
      this.fileService.deleteFolder(this.folders[this.index].name).subscribe(
        (data) => {
          if (data['result'] === 'success') {
            this.toastrService.success(
              `Xóa thành công !`, '', { timeOut: 2000 }
            )
            this.folders.splice(this.index, 1)
          }
          else if (data['result'] === 'error') {
            this.toastrService.success(
              `Không thể xóa !`, '', { timeOut: 2000 }
            )
          }
          else {
            this.toastrService.info(
              `Không tìm thấy folder !`, '', { timeOut: 2000 }
            )
          }
        },
        () => {
          this.toastrService.error(
            `Đã có lỗi xảy ra, hãy thử lại !`, '', { timeOut: 2000 }
          )
        }
      )
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
