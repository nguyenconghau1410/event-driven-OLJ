import { Component } from '@angular/core';
import { ContestService } from '../../api/contest/contest.service';
import { Contest } from '../../models/contest.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data/data.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  contest!: Contest
  private countdownSubscription!: Subscription
  countdown: string = ''
  text: string = ''
  id!: string
  user!: User
  constructor(
    private contestService: ContestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem('access_token')) {
      this.router.navigate(['login'])
      return
    }
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id']
        this.contestService.getContest(params['id']).subscribe(
          (data) => {
            if (data) {
              this.contest = data

              this.dataService.user?.subscribe(
                user => {
                  this.user = user
                }
              )
              if(!this.contest.noTime)
                this.handleTime()
              else
                this.text = "Nhấn Enter để tham gia contest!"
            }
          }
        )
      }
    })
  }


  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  handleTime() {
    if (this.calculateTimeRemaining() === 'Expired') {
      this.text = "Đã tới thời gian làm contest, hãy vào làm!"
      this.countdownSubscription.unsubscribe()
      return
    }
    else if (this.calculateTimeRemaining() === 'Finished') {
      this.text = "Contest đã kết thúc!"
      this.countdownSubscription.unsubscribe()
      return
    }

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.calculateTimeRemaining();
    });

    this.calculateTimeRemaining();

  }

  calculateTimeRemaining() {
    const endDate = new Date(`${this.contest.endTime}T${this.contest.hourEnd}:00`).getTime();
    const startDate = new Date(`${this.contest.startTime}T${this.contest.hourStart}:00`).getTime();
    let now = new Date().getTime();
    let difference = endDate - now;

    if (difference <= 0) {
      this.countdown = 'Finished'
      return this.countdown
    }
    now = new Date().getTime()
    difference = startDate - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      this.text = this.countdown
    } else {
      this.countdown = 'Expired';
    }
    return this.countdown
  }

  redirect() {
    if(!this.contest.noTime) {
      if (this.calculateTimeRemaining() === 'Finished') {
        this.router.navigate(['contests', this.id, 'challenges'])
        return
      }
      if (this.countdown !== 'Expired') {
        this.toastrService.info(
          'Vẫn chưa đến thời gian làm bài!', '', { timeOut: 2000 }
        )
        return
      }
    }
    
    let ok = false
    if (this.contest.mode === 'RR') {
      for (let i = 0; i < this.contest.participants.length; i++) {
        if (this.user.email === this.contest.participants[i].email) {
          ok = true
          if(!this.contest.participants[i].joined) {
            this.contest.participants[i].joined = true
            this.contestService.update(this.contest).subscribe(
              () => {
                this.router.navigate(['contests', this.id, 'challenges'])
              }
            )
          }
          else {
            this.router.navigate(['contests', this.id, 'challenges'])
          }
        }
      }
    }
    else {
      for (let i = 0; i < this.contest.participants.length; i++) {
        if (this.contest.participants[i].email === this.user.email) {
          if(!this.contest.participants[i].joined) {
            this.contestService.update(this.contest).subscribe(
              () => {
                this.router.navigate(['contests', this.id, 'challenges'])
              }
            )
          }
          else {
            this.router.navigate(['contests', this.id, 'challenges'])
          }
          return
        }
      }
      this.contest.participants.push({ email: this.user.email, joined: true })
      this.contestService.update(this.contest).subscribe(
        () => {
          this.router.navigate(['contests', this.id, 'challenges'])
        }
      )
      return
    }
    if (!ok) {
      this.toastrService.info(
        'Bạn chưa được đăng ký để tham gia contest này!', '',
        { timeOut: 2000 }
      )
    }
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
