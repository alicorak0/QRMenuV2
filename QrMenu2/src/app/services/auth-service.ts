import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LoginModel } from '../models/loginModel';
import { jwtDecode} from 'jwt-decode';
import { BehaviorSubject, Observable,of } from 'rxjs';
import { MeResponseModel } from '../models/meResponseModel';
import { map, catchError } from 'rxjs/operators';
import { API_ROOT_URL } from '../constants/categoryConstants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl=`${API_ROOT_URL}/auth/`

        constructor(private httpClient:HttpClient){}

private currentUserSubject = new BehaviorSubject<MeResponseModel | null>(null);




   login(loginModel: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + 'login', loginModel, { withCredentials: true });
  }

  me(): Observable<MeResponseModel> {
  return this.httpClient.get<MeResponseModel>(this.apiUrl + 'me', { withCredentials: true }).pipe(
    map(user => {
      this.currentUserSubject.next(user); // Burada component’e currentUser bildiriliyor
      return user;
    })
  );
}


  // Kişi authentice mi ?

   isAuthenticated(): Observable<boolean> {
    return this.httpClient.get(this.apiUrl + 'me', { withCredentials: true }).pipe(
      map(_ => true),
      catchError(_ => of(false))
    );
  }

logout(): Observable<any> {
  return this.httpClient.post(this.apiUrl + 'logout', {}, { withCredentials: true }).pipe(
    map(res => {
      // 🔹 BehaviorSubject’i temizle
      this.currentUserSubject.next(null); // tüm component’lere bildir
      return res;
    })
  );
}

get currentUserValue(): MeResponseModel | null {
  return this.currentUserSubject.value;
}


}









