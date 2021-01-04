import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {share} from 'rxjs/operators';
import {Token} from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static BASE_URL = `${environment.backend_url}/auth`;
  jwtHelperService = new JwtHelperService();

  public currentUser: User = null;

  constructor(private http: HttpClient) {
    this.updateCurrentUser();
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public login(user: User): Observable<HttpResponse<User>> {
    const loginObservable: Observable<HttpResponse<User>> = this.http.post<User>(`${AuthService.BASE_URL}/login`,
      user,
      {
        observe: 'response'
      }
    ).pipe(share());

    loginObservable.subscribe(res => {
        let authToken = res.headers.get('Authorization');

        if (authToken == null) {
          throw new Error('Token was not provided back from the response');
        }

        authToken = authToken.replace('Bearer', '');
        localStorage.setItem('token', authToken);

        this.currentUser = User.trueCopy(res.body);

        // this.updateCurrentUser();
      },
      error => {
        console.log(error);
        this.logout();
      });

    return loginObservable;
  }

  public signup(user: User): Observable<User> {
    return this.http.post<User>(`${AuthService.BASE_URL}/signup`, user).pipe(share());
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  public isAdmin(): boolean {
    return this.isLoggedIn() && this.currentUser.isAdmin();
  }

  public resendVerificationEmail(user: User): Observable<any> {
    return this.http.post<any>(`${AuthService.BASE_URL}/verify/resend`, user);
  }

  public getVerificationToken(token: string): Observable<any> {
    return this.http.get<Token>(`${AuthService.BASE_URL}/verify?token=${token}`);
  }

  public verifyEmailByToken(userId: number, token: Token): Observable<User> {
    return this.http.put<User>(`${AuthService.BASE_URL}/verify/${userId}`, token);
  }

  private updateCurrentUser(): void {
    if (this.getToken()) {
      const decodeToken = this.jwtHelperService.decodeToken(this.getToken());

      this.currentUser = new User();
      this.currentUser.setId(parseInt(decodeToken.sub));
      this.currentUser.setEmail(decodeToken.email);
      this.currentUser.setAdmin(decodeToken.admin.toLowerCase() === 'true');
    }
  }

  public resetPassword(token: string, user: User): Observable<any> {
    return this.http.put(`${AuthService.BASE_URL}/reset-password?token=${token}`, user);
  }

  public requestResetPassword(user: User): Observable<User>{
    return this.http.post<User>(`${AuthService.BASE_URL}/reset-password`, user);
  }

}
