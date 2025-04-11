import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Contest } from '../../models/contest.model';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../api/contest/contest.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-contest',
  standalone: true,
  imports: [CKEditorModule, FormsModule, CommonModule],
  templateUrl: './create-contest.component.html',
  styleUrl: './create-contest.component.scss'
})
export class CreateContestComponent {
  public Editor = Editor;
  contest: Contest = {
    id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    problems: [],
    participants: [],
    state: '',
    hourStart: '',
    hourEnd: '',
    mode: '',
    signups: [],
    createdBy: '',
    finished: false,
    noTime: false,
  }
  checkbox = false

  constructor(
    private contestService: ContestService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setMinDate();
  }

  setMinDate(): void {
    const datePickerStart: HTMLInputElement | null = document.getElementById('datePickerStart') as HTMLInputElement;
    const datePickerEnd: HTMLInputElement | null = document.getElementById('datePickerEnd') as HTMLInputElement;
    if (datePickerStart && datePickerEnd) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      const todayFormatted = `${year}-${month}-${day}`;
      datePickerStart.min = todayFormatted;
      datePickerEnd.min = todayFormatted;
    }
  }

  create() {
    if (!this.checkInformation()) {
      this.toastrService.info(
        `Hãy điền đầy đủ các thông tin!`, '', { timeOut: 2000 }
      )
      return
    }
    this.contestService.create(this.contest).subscribe(
      (data) => {
        if (data) {
          this.toastrService.success(
            'Tạo thành công', '', { timeOut: 2000 }
          )
          setTimeout(() => {
            this.router.navigate(["my-contest"])
          }, 2000);
        }
      },
      (error) => {
        this.toastrService.error(
          `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 2000 }
        )
      }
    )
  }

  clickCheckBox() {
    this.checkbox = !this.checkbox
    if(this.checkbox)
      this.contest.noTime = true;
    else
      this.contest.noTime = false;
    this.contest.endTime = ''
    this.contest.hourEnd = ''
  }

  checkInformation(): boolean {
    if (!this.contest.title || !this.contest.description
      || !this.contest.startTime || !this.contest.hourStart) {
      return false
    }
    return true
  }
}
