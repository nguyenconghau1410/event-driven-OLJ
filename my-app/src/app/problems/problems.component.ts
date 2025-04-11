import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Problem } from '../models/problem.model';
import { ProblemService } from '../api/problem/problem.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../api/topic/topic.service';
import { Topic } from '../models/topic.model';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [NzIconModule, CommonModule, NzPaginationModule, FormsModule],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.scss'
})
export class ProblemsComponent {
  problems: any = [];
  index: number = 1
  total: number = 0
  topics: Topic[] = []
  formSearch: { search: string, pageNumber: number, id: string, difficulty: string  } = {
    search: '',
    pageNumber: this.index - 1,
    id: '',
    difficulty: '',
  }
  search = false
  constructor(
    private problemService: ProblemService,
    private activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.topicService.getAllTopic().subscribe(
      (data) => {
        this.topics = data
      }
    )
    this.problemService.getTotalRecord().subscribe(
      (data) => {
        this.total = data['total']
      }
    )
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['search']) {
        this.search = true
        let page = 1
        if (params['page']) {
          page = params['page']
          this.index = page
        }
        this.formSearch.pageNumber = page - 1
        this.problemService.getSearch(this.formSearch).subscribe(
          (data) => {
            if (data) {
              this.problems = data['list']
              this.total = data['total']
            }
          }
        )
        return
      }
      let page = 1
      if (params['page']) {
        page = params['page']
        this.index = page
      }
      this.problemService.getAllProblem(page - 1).subscribe(
        (data) => {
          if (data) {
            this.problems = data
          }
        },
        (error) => {
          if (error.status !== 401) {
            this.toastr.error(
              `Đã có lỗi xẩy ra ${error.status}`, '', { timeOut: 2000 }
            )
          }
        }
      )
    })
  }

  convertDifficulty(str: string): string {
    if(str === 'easy') return "Dễ";
    else if(str === 'medium') return "Trung bình";
    else return 'Khó';
  }

  onPageIndexChange(event: number) {
    if (this.search) {
      this.router.navigate(['problems'], { queryParams: { page: event, search: true } })
      return
    }
    this.router.navigate(['problems'], { queryParams: { page: event } })
  }

  calculate(ac: number, total: number) {
    return (ac / total * 100).toFixed(2)
  }

  onSubmit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.router.navigate(['problems'], { queryParams: { search: true } })
    this.problemService.getSearch(this.formSearch).subscribe(
      (data) => {
        if (data) {
          this.problems = data['list']
          this.total = data['total']
        }
      },
      (error) => {
        this.toastr.error(
          `Đã có lỗi xảy ra`, '', { timeOut: 2000 }
        )
      }
    )
  }

  onReset() {
    this.router.navigate(['problems'])
  }
}
