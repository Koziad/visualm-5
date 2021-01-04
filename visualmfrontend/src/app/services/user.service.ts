import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {User} from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static BASE_URL = `${environment.backend_url}/user`;
  public updatedUser = new Subject<User>();
  helper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${UserService.BASE_URL}`);
  }

  public getUser(user: User): Observable<User>{
    return this.http.post<User>(`${UserService.BASE_URL}/login`, user);
  }

  public getUserProfile(id: number): Observable<User>{
    return this.http.get<User>(`${UserService.BASE_URL}/${id}`);
  }

  public updateUserProfile(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${UserService.BASE_URL}/${id}`, user);
  }

  public delete(id: number): void {
    this.http.delete(`${UserService.BASE_URL}/${id}`).subscribe();
  }
}
