import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/productModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ResponseModel } from '../models/responseModel';
import { API_ROOT_URL } from '../constants/categoryConstants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${API_ROOT_URL}/products/`;

  constructor(private http: HttpClient) { }

 //Tüm ürünleri al
  getAllProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.apiUrl}getall`);
  }

// Belirli kategoriye göre ürünleri al
   getProductsByCategory(categoryPath: string): Observable<{ data: Product[] }> {
     // backend'in parametre kabul ettiği URL formatına göre düzenle
     return this.http.get<{ data: Product[] }>(`${this.apiUrl}getbycategoryname/${categoryPath}`);
   }

  getAllFeaturedProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.apiUrl}getallfeaturedproduct`);
  }

  productSearch(name: string):Observable<SingleResponseModel<Product[]>> {
    return this.http.get<SingleResponseModel<Product[]>>(`${this.apiUrl}search?name=${name}`);
  }


  addProduct(product: Product): Observable<SingleResponseModel<Product>> {
    return this.http.post<SingleResponseModel<Product>>(`${this.apiUrl}add`, product,{ withCredentials: true });
  }


 deleteProduct(id:number){
  return this.http.delete<ResponseModel>(`${this.apiUrl}delete/${id}`,{ withCredentials: true });

 }
 
 updateProduct(product: Product): Observable<SingleResponseModel<Product>> {
    return this.http.post<SingleResponseModel<Product>>(`${this.apiUrl}update`, product,{ withCredentials: true });
  }

  getProductsByCategoryId(categoryId: number): Observable<{ data: Product[] }> {
  return this.http.get<{ data: Product[] }>(
    `${this.apiUrl}getbycategory?categoryId=${categoryId}`
  );
}

}
