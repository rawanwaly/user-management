import { Observable } from "rxjs";
import { User } from "./user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
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
  
  checkEmailExists(email: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
}
  
    checkMobileExists(mobile: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/check-mobile?mobile=${mobile}`);
    }
}