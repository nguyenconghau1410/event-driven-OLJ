import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { ProblemService } from '../../api/problem/problem.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { MatIconModule } from '@angular/material/icon';
import { Topic } from '../../models/topic.model';
import { TopicService } from '../../api/topic/topic.service';
import { CheckStatusService } from '../../service/check/check-status.service';
import { FileService } from '../../api/file/file.service';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-edit-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule, MatIconModule],
  templateUrl: './edit-problem.component.html',
  styleUrl: './edit-problem.component.scss'
})
export class EditProblemComponent {
  problem!: Problem
  categories: Topic[] = []
  selectedType: Topic[] = []
  inputFiles: File[] = []
  outputFiles: File[] = []
  inputString: string[] = []
  outputString: string[] = []
  folder = ''
  public Editor = Editor;
  check: boolean = true
  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private topicService: TopicService,
    private status: CheckStatusService,
    private fileService: FileService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.user?.subscribe(
      user => {
        if (user.role!.code === 'STUDENT') {
          this.check = false
          return
        }
      }
    )
    if (!this.check) return
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.problemService.getProblem(params['id']).subscribe(
          (data) => {
            this.problem = data
          },
          (error) => {
            this.toastrService.error(
              `Error: ${error.status}`, '',
              { timeOut: 2000 }
            )
          }
        )
        this.topicService.getTopicOfProblem(params['id']).subscribe(
          (data) => {
            if (data) {
              this.selectedType = data
            }
          },
          (error) => {
            this.toastrService.error(
              `Error: ${error.status}`, '',
              { timeOut: 2000 }
            )
          }
        )
      }
    })
    this.topicService.getAllTopic().subscribe(
      (data) => {
        if (data) {
          this.categories = data
        }
      },
      (error) => {
        this.toastrService.error(
          `Error: ${error.status}`, '',
          { timeOut: 2000 }
        )
      }
    )
  }

  showCategory() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    const inputDropdown = document.getElementById("inputDropdown");

    inputDropdown?.addEventListener("click", function (event) {
      if (dropdownOptions!.style.display === "none") {
        dropdownOptions!.style.display = "block";
        document.addEventListener("click", closeDropdownOnClickOutside);
        event.stopPropagation();
      }
    });

    const closeDropdownOnClickOutside = function (event: any) {
      if (!inputDropdown!.contains(event.target)) {
        dropdownOptions!.style.display = "none";
        document.removeEventListener("click", closeDropdownOnClickOutside);
      }
    };
  }

  removeSelected(index: number) {
    this.selectedType.splice(index, 1)
  }

  addCategory(category: any) {
    this.selectedType.push(category)
  }

  clearTestcase() {
    this.folder = this.status.getFolder(this.problem.testcase[0]['input'])
    this.problem.testcase = []
  }

  onFileChange(event: Event, type: string) {
    if (type === 'input') {
      const input = event.target as HTMLInputElement
      if (input.files) {
        this.inputFiles = Array.from(input.files)
      }
    }
    else {
      const output = event.target as HTMLInputElement
      if (output.files) {
        this.outputFiles = Array.from(output.files)
      }
    }
  }

  uploadFile() {
    if (this.problem.testcase.length === 0) {
      this.fileService.deleteFolder(this.folder).subscribe(
        () => {
          this.toastrService.success(
            'Deleted!', '', { timeOut: 2000 }
          )
        }
      )
    }
    if (this.checkUploadFile()) {
      const folder = this.problem.id
      if (this.inputFiles.length !== 0 && this.outputFiles.length !== 0) {
        this.fileService.uploadFile(this.inputFiles, folder, 'input').subscribe(
          (data) => {
            if (data) {
              for (let i = 0; i < data.length; i++) {
                this.inputString.push(data[i])
              }
              this.toastrService.success(
                'Upload success', '',
                { timeOut: 1000 }
              )
            }
          },
          (error) => {
            if (error.status === 403) {
              this.toastrService.error(
                `ProblemID đã tồn tại, hãy đặt tên khác !`, '',
                { timeOut: 2000 }
              )
            }
            else {
              this.toastrService.error(
                `Đã có lỗi xảy ra, hãy thử lại !`, '',
                { timeOut: 2000 }
              )
            }
          }
        )
        this.fileService.uploadFile(this.outputFiles, folder, 'output').subscribe(
          (data) => {
            if (data) {
              for (let i = 0; i < data.length; i++) {
                this.outputString.push(data[i])
              }
              this.toastrService.success(
                'Upload success', '',
                { timeOut: 1000 }
              )
            }
          },
          (error) => {
            if (error.status === 403) {
              this.toastrService.error(
                `ProblemID đã tồn tại, hãy đặt tên khác !`, '',
                { timeOut: 2000 }
              )
            }
            else {
              this.toastrService.error(
                `Đã có lỗi xảy ra, hãy thử lại !`, '',
                { timeOut: 2000 }
              )
            }
          }
        )
      }
      else {
        this.toastrService.info(
          'Please select the files then upload!',
          '',
          { timeOut: 1000 }
        )
      }
    }
  }

  save() {
    this.inputString.sort()
    this.outputString.sort()
    for (let i = 0; i < this.inputString.length; i++) {
      this.problem.testcase.push({ input: this.inputString[i], output: this.outputString[i] })
    }
    if (!this.checkInformation()) {
      this.toastrService.warning(
        'Please fill in all missing input!', '',
        { timeOut: 2000 }
      )
      return
    }
    this.problemService.update(this.problem, this.selectedType).subscribe(
      () => {
        this.toastrService.success(
          "Saved successfully", '', { timeOut: 2000 }
        )
      },
      (error) => {
        this.toastrService.error(
          `Error! An error occurred: ${error.status}`, '', { timeOut: 2000 }
        )
      }
    )
  }
  removeFileSelected(index: number, type: string) {
    if (type === 'input') {
      this.inputFiles.splice(index)
    }
    else {
      this.outputFiles.splice(index)
    }
  }

  checkUploadFile() {
    if (this.inputFiles.length !== this.outputFiles.length) {
      this.toastrService.info(
        'The size inputList and outputList is not equal!', '',
        { timeOut: 2000 }
      )
      return false
    }
    else if (this.problem.testcase.length !== 0) {
      this.toastrService.info(
        'Please let clear all testcase then upload!', '',
        { timeOut: 2000 }
      )
      return false
    }
    return true
  }

  checkInformation() {
    if (!this.problem.id || !this.problem.title || !this.problem.description || !this.problem.input || !this.problem.output ||
      !this.problem.constraints || this.problem.sample.length === 0 || !this.problem.timeLimit ||
      !this.problem.memoryLimit || !this.problem.difficulty) {
      return false;
    }
    return true;
  }
}
