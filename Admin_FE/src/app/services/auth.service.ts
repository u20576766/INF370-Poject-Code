import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  apiUrl = 'https://localhost:7121/api/'

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {

  }

  //--------------------------------Log In--------------------------------------//



  LogIn(logInUser: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + 'Account/login', logInUser)
      .pipe(
        tap((response: User) => {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
        })
      );
  }

}
