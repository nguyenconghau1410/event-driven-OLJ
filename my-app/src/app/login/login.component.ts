import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth/auth.service';
import { TokenService } from '../service/token/token.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  toastr = inject(ToastrService)
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private apiAuth: AuthService,
    private tokenService: TokenService
  ) {

  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      if (user !== null) {
        this.apiAuth.login(user.idToken)
          .subscribe((data) => {
            if (data !== null) {
              this.tokenService.setAccessToken(data['access_token'])
              this.showToast()
            }
          }, (error) => {
            console.log(error)
          }
        )
      }
    });
  }

  showToast(): void {
    this.toastr.success('Đăng nhập thành công', '', {
      timeOut: 3000,
      progressBar: true,

    })
    setTimeout(() => {
      window.location.href = '/problems'
    }, 3500)
  }

}
