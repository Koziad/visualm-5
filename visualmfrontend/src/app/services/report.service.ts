import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Material} from '../models/material';
import {Report} from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private static BASE_URL = `${environment.backend_url}/report`;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Report[]> {
    return this.http.get<Report[]>(`${ReportService.BASE_URL}`);
  }

  public getById(id: number): Observable<Report>{
    return this.http.get<Report>(`${ReportService.BASE_URL}/${id}`);
  }

  public save(report: Report): Observable<Report> {
    return this.http.post<Report>(`${ReportService.BASE_URL}`, report);
  }

  public update(id: Number, report: Report): Observable<Report> {
    return this.http.put<Report>(`${ReportService.BASE_URL}/${id}`, report);
  }

  public getByUserId(id: number): Observable<User>{
    return this.http.get<User>(`${ReportService.BASE_URL}/user/${id}`);
  }

  public getByMaterialId(id: number): Observable<Material>{
    return this.http.get<Material>(`${ReportService.BASE_URL}/material/${id}`);
  }

  delete(id: number): void {
    this.http.delete(`${ReportService.BASE_URL}/${id}`).subscribe();
  }
}
