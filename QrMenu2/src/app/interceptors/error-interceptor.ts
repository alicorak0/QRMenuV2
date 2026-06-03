import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        // 🔴 401 - login süresi dolmuş
        if (error.status === 401) {
          this.toastr.warning("Lütfen Giriş Yapınız");

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        }

        // 🔴 403 - yetki yok
        else if (error.status === 403) {
          this.toastr.error("Bu işlem için yetkiniz yok!");
        }

        

        return throwError(() => error);
      })

    );
  }
}