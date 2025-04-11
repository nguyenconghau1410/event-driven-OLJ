import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProblemService } from '../api/problem/problem.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Problem } from '../models/problem.model';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-detail-problem',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './detail-problem.component.html',
  styleUrl: './detail-problem.component.scss',
})
export class DetailProblemComponent {
  id: string | undefined
  contestId: string = ''
  problem: Problem | undefined
  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['problemId']
      this.contestId = params['id']
      console.log(this.contestId)
      if (this.id) {
        this.problemService.getProblem(this.id!).subscribe(
          (data) => {
            this.problem = data
          },
          (error) => {
            if (error.status !== 401) {
              this.toastrService.error(
                `Đã có lỗi xảy ra: ${error.status}`, '', { timeOut: 1000 }
              )
            }
          }
        )
      }
    })
  }

  check(): boolean {
    return this.contestId ? false : true
  }

  redirect(type: string) {
    if (type == 'me')
      this.router.navigate(['problems', this.problem?.id, 'my-submissions'])
    else
      this.router.navigate(['problems', this.problem?.id, 'all-submissions'])
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
