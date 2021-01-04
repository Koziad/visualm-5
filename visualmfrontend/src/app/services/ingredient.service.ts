import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ingredient} from '../models/ingredient';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private static BASE_URL = `${environment.backend_url}/ingredients`;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${IngredientService.BASE_URL}`);
  }

  public save(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${IngredientService.BASE_URL}`, ingredient);
  }

  public getById(id: number): Observable<User>{
    return this.http.get<User>(`${IngredientService.BASE_URL}/${id}`);
  }

  public getAllByName(name: string): Observable<Ingredient[]> {
    const encodedURI = encodeURIComponent(name);

    return this.http.get<Ingredient[]>(`${IngredientService.BASE_URL}/search?name=${encodedURI}`);
  }

  delete(id: number): void {
    this.http.delete(`${IngredientService.BASE_URL}/${id}`).subscribe();
  }
}
