import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  private static BASE_URL = `${environment.backend_url}/materials`;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Material[]> {
    return this.http.get<Material[]>(`${MaterialsService.BASE_URL}`);
  }

  public getBySequenceNumber(sequenceNumber: number): Observable<Material> {
    return this.http.get<Material>(`${MaterialsService.BASE_URL}/${sequenceNumber}`);
  }

  public getMaterialByUser(id: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${MaterialsService.BASE_URL}/user/${id}`);
  }

  public createBitlyLinkFromURL(url: string): Observable<any> {
    const headers = { 'Authorization': 'Bearer ' + environment.bitly_key };

    const body = {
      'group_guid': environment.bitly_group_guid,
      'domain': 'bit.ly',
      'long_url': url
    }

    return this.http.post<any>('https://api-ssl.bitly.com/v4/shorten', body, {'headers': headers});
  }

  public save(material: Material): Observable<Material> {
    return this.http.post<Material>(`${MaterialsService.BASE_URL}`, material);
  }

  delete(sequenceNumber: number): void {
    this.http.delete(`${MaterialsService.BASE_URL}/${sequenceNumber}`).subscribe();
  }

  public update(id: number, material: Material): Observable<Material> {
    return this.http.put<Material>(`${MaterialsService.BASE_URL}/${id}`, material);
  }
}
