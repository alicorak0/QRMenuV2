import { Injectable } from '@angular/core';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ResponseModel } from '../models/responseModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/categoryModel';
import { API_ROOT_URL } from '../constants/categoryConstants';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${API_ROOT_URL}/categories/`;

  constructor(private http: HttpClient) { }

   getAllCategories(): Observable<{ data: Category[] }> {
      return this.http.get<{ data: Category[] }>(`${this.apiUrl}getall`);
    }

deleteCategory(id:number){
  return this.http.delete<ResponseModel>(`${this.apiUrl}delete/${id}`,{ withCredentials: true });

 }

updateCategory(category: Category): Observable<SingleResponseModel<Category>> {
    return this.http.post<SingleResponseModel<Category>>(`${this.apiUrl}update`, category,{ withCredentials: true });
  }

   addCategory(category: Category): Observable<SingleResponseModel<Category>> {
      return this.http.post<SingleResponseModel<Category>>(`${this.apiUrl}add`, category,{ withCredentials: true });
    }

}
