
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { TopicService } from '../../api/topic/topic.service';
import { CheckStatusService } from '../../service/check/check-status.service';
import { Topic } from '../../models/topic.model';
import { Problem } from '../../models/problem.model';
import { FormsModule } from '@angular/forms';
import { ProblemService } from '../../api/problem/problem.service';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../api/file/file.service';
import { Router } from '@angular/router';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-create-problem',
  standalone: true,
  imports: [CKEditorModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './create-problem.component.html',
  styleUrl: './create-problem.component.scss'
})
export class CreateProblemComponent {
  public Editor = Editor;
  sampleInputsOutputs: { input: string, output: string }[] = [
    { input: '', output: '' }
  ];
  selectedType: { name: string, id: string }[] = []
  categories: Topic[] = []
  inputFiles: File[] = []
  outputFiles: File[] = []
  inputString: string[] = []
  outputString: string[] = []
  problem: Problem = {
    id: '',
    title: '',
    description: '',
    input: '',
    output: '',
    constraints: '',
    sample: [],
    timeLimit: '',
    memoryLimit: '',
    difficulty: '',
    email: '',
    src: '',
    state: '',
    testcase: []
  };
  nameFolder = ''
  create = false
  check: boolean = true
  constructor(
    private topicService: TopicService,
    private status: CheckStatusService,
    private problemService: ProblemService,
    private toastrService: ToastrService,
    private fileService: FileService,
    private router: Router,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.dataService.user?.subscribe(
      user => {
        if (user.role!.code === 'STUDENT') {
          this.check = false
          return
        }
      }
    )
    if (!this.check) return
    this.topicService.getAllTopic().subscribe(
      (data) => {
        this.categories = data
      },
      (error) => {
        this.status.checkStatusCode(error.status)
      }
    )
  }

  addSampleIO() {
    this.sampleInputsOutputs.push({ input: '', output: '' })
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

  addCategory(category: any) {
    this.selectedType.push(category)
  }

  removeSelected(index: number) {
    this.selectedType.splice(index, 1)
  }

  addProlem() {
    this.inputString.sort()
    this.outputString.sort()
    for (let i = 0; i < this.inputString.length; i++) {
      this.problem.testcase.push({ input: this.inputString[i], output: this.outputString[i] })
    }
    this.problem.sample = this.getDataFormTextarea()
    if (!this.checkInformation()) {
      this.toastrService.warning(
        'Please fill in all missing input!', '',
        { timeOut: 2000 }
      )
      return
    }
    this.problemService.addProblem(this.problem, this.selectedType).subscribe(
      (data) => {
        if (data['Error']) {
          this.toastrService.error('ProblemID đã tồn tại', '', { timeOut: 2000 })
          return
        }
        this.create = true
        this.toastrService.success(
          'Created',
          '',
          {
            timeOut: 2000,
          }
        )
        setTimeout(() => {
          window.location.href = '/administration'
        }, 3000)
      },
      (error) => {
        this.status.checkStatusCode(error.status)
      }
    )
  }

  getDataFormTextarea(): any {
    const sample = []
    for (let i = 0; i < this.sampleInputsOutputs.length; i++) {
      const input = document.getElementById('input-' + i) as HTMLTextAreaElement
      const output = document.getElementById('output-' + i) as HTMLTextAreaElement

      const inputData = input.value
      const outputData = output.value
      sample.push({ inputData, outputData })
    }
    return sample
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

  removeFileSelected(index: number, type: string) {
    if (type === 'input') {
      this.inputFiles.splice(index)
    }
    else {
      this.outputFiles.splice(index)
    }
  }

  uploadFile() {
    if (this.checkUploadFile()) {
      const folder = this.problem.id
      this.nameFolder = folder
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
                { timeOut: 2000 }
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
                { timeOut: 1000 }
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

  checkUploadFile() {
    if (this.inputFiles.length !== this.outputFiles.length) {
      this.toastrService.info(
        'The size inputList and outputList is not equal!', '',
        { timeOut: 2000 }
      )
      return false
    }
    else if (this.problem.id === '') {
      this.toastrService.info(
        'Enter the ProblemID !', '',
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

