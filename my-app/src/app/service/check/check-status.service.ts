import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CheckStatusService {

  constructor(
    private toastr: ToastrService,
  ) { }


  checkStatusCode(statusCode: number) {
    if (statusCode === 401) {
      sessionStorage.removeItem('access_token')
      this.toastr.warning(`Token đã hết hạn, hãy đăng nhập lại`, '', {
        timeOut: 3000,
        progressBar: true
      })
      setTimeout(() => {
        window.location.href = '/login'
      }, 3500)
    }
    else {
      this.toastr.warning(`Đã có lỗi xảy ra: ${statusCode}`, '', {
        timeOut: 1000,
      })
    }
  }

  getFolder(token: string): string {
    let folder = ''
    for (let i = 11; i < token.length; i++) {
      if (token[i] === "\\") {
        break
      }
      folder += token[i]
    }
    return folder
  }
}
