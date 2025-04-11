import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, UrlSegment } from '@angular/router';
import { DataService } from '../service/data/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  index = 4
  check = false
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
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
  }

  redirect(i: number) {
    if (i === 0) {
      this.index = 0
      this.router.navigate(['admin', 'problems'])
    }
    else if (i === 1) {
      this.index = 1
      this.router.navigate(['admin', 'members'])
    }
    else if (i === 2) {
      this.index = 2
      this.router.navigate(['admin', 'contests'])
    }
    else if (i === 4) {
      this.index = 4
      this.router.navigate(['admin', 'categories'])
    }
    else {
      this.index = 3
      this.router.navigate(['admin', 'testcases'])
    }
  }
}
