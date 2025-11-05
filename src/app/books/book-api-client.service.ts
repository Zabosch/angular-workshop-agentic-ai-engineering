import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly apiUrl = 'http://localhost:4730/books';

  constructor(private http: HttpClient) {}

  getBooks(pageSize: number = 10, searchTerm?: string): Observable<Book[]> {
    let params = new HttpParams().set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBook(id: string): Observable<Book> {
    // GET /books/:id
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    // Use PUT for full update. If your API expects PATCH, change to http.patch.
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }
}
