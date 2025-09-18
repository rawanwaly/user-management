import { Observable } from 'rxjs';
import { User } from './user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  GridRequest,
  GridResponse,
} from 'src/app/components/models/grid.models';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkEmailExists(email: string, excludeId?: number): Observable<boolean> {
    let url = `${this.apiUrl}/check-email?email=${email}`;
    if (excludeId) {
      url += `&excludeId=${excludeId}`;
    }
    return this.http.get<boolean>(url);
  }

  checkMobileExists(mobile: string, excludeId?: number): Observable<boolean> {
    let url = `${this.apiUrl}/check-mobile?mobile=${mobile}`;
    if (excludeId) {
      url += `&excludeId=${excludeId}`;
    }
    return this.http.get<boolean>(url);
  }
  getAllIds(search: string = ''): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/all-ids`, {
      params: { search },
    });
  }

  getPagedUsers(req: GridRequest): Observable<GridResponse<User>> {
    let params = new HttpParams()
      .set('page', req.page)
      .set('pageSize', req.pageSize);

    if (req.search) params = params.set('search', req.search);
    if (req.sortColumn) {
      params = params
        .set('sortColumn', String(req.sortColumn))
        .set('sortDirection', req.sortDirection || 'asc');
    }

    return this.http.get<GridResponse<User>>(`${this.apiUrl}/paged`, {
      params,
    });
  }
}
