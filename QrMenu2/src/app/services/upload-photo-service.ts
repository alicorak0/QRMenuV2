import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROOT_URL } from '../constants/categoryConstants';

@Injectable({
  providedIn: 'root',
})
export class UploadPhotoService {
  private api = `${API_ROOT_URL}/upload`;


  constructor(private http: HttpClient) { }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ fileName: string, url: string }>(this.api, formData);
  }




}
