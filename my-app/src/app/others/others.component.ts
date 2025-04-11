import { Component } from '@angular/core';
import { UserService } from '../api/user/user.service';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {

  user!: User
  data: any

  check: boolean = false
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.userService.getInfoUser(params['id']).subscribe(
          (data) => {
            if (data) {
              this.user = data['user']
              this.data = data
            }
          },
          (error) => {
            this.check = true
          }
        )
      }
    })
  }

  topUser(index: number) {
    if (index === -1)
      return '###'
    return index + 1
  }
}
