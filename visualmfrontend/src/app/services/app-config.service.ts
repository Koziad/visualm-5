import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {share} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private static BASE_URL = `${environment.backend_url}/config`;

  constructor(private http: HttpClient) { }

  public update(config: {email_suffix: string, organisation: string, logo_path: string}): Observable<any> {
    return this.http.put<object>(`${AppConfigService.BASE_URL}/default`, config).pipe(share());
  }

  public getAll(): Observable<any> {
    return this.http.get(`${AppConfigService.BASE_URL}`).pipe(share());
  }
}
