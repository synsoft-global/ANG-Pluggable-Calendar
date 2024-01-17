import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:5001/api/';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient) { }

  get(url: string): Observable<unknown> {
    return this.http.get(`${baseUrl}/${url}`);
  }

  post(url: string, data: unknown): Observable<unknown> {
    return this.http.post(`${baseUrl}/${url}`, data);
  }

  put(url: string, data: unknown): Observable<unknown> {
    return this.http.put(`${baseUrl}/${url}`, data);
  }

  delete(url: string): Observable<unknown> {
    return this.http.delete(`${baseUrl}/${url}`);
  }
}