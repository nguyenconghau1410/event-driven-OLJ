import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Topic } from '../../models/topic.model';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../api/topic/topic.service';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DataService } from '../../service/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-manage',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, NzModalModule],
  templateUrl: './categories-manage.component.html',
  styleUrl: './categories-manage.component.scss'
})
export class CategoriesManageComponent {
  check = false
  showCreatedForm = false
  topic = {
    name: '',
    code: ''
  }
  topics: any
  isVisible = false
  index = -1
  textOk = 'Đồng ý'
  textCancel = 'Không'
  constructor(
    private topicService: TopicService,
    private toastrService: ToastrService,
    private dataService: DataService,
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
    this.topicService.getAllTopic().subscribe(
      (data) => {
        if (data) {
          this.topics = data
        }
      },
      () => {
        this.check = true
      }
    )
  }

  openForm() {
    this.showCreatedForm = true
  }

  closeForm() {
    this.topic = {
      name: '',
      code: ''
    };
    this.showCreatedForm = false
  }

  save() {
    this.topicService.addTopic(this.topic).subscribe(
      (data) => {
        if (data) {
          this.toastrService.success(
            'Thêm thành công', '', { timeOut: 2000 }
          )
          this.topics.push(data)
        }
      },
      (error) => {
        if(error.status === 409) {
          this.toastrService.error(
            `Mã code đã tồn tại`, '', { timeOut: 2000 }
          )
        }
        else {
          this.toastrService.error(
            `Đã có lỗi xảy ra, ${error.status}`, '', { timeOut: 2000 }
          )
        }
      }
    )
    this.closeForm();
  }

  showModal(i: number): void {
    this.index = i
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.index !== -1) {
      this.topicService.deleteTopic(this.topics[this.index].id).subscribe(
        (data) => {
          if (data['result'] === 'success') {
            this.toastrService.success(
              `Xóa thành công`, '', { timeOut: 2000 }
            )
            this.topics.splice(this.index, 1)
          }
          else {
            this.toastrService.info(
              `Không thể xóa`, '', { timeOut: 2000 }
            )
          }
        },
        (error) => {
          this.toastrService.error(
            `Đã có lỗi xảy ra, ${error.status}`, '', { timeOut: 2000 }
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
