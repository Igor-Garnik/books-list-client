import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Book } from '../models/book';
import { Format } from '../models/format';
@Injectable()
export class BookApiService {

  localApiUrl = "http://localhost:3000"

  constructor(
    private http: HttpClient
  ) { }

  getBooksList(): Observable<any> {
    return this.http.get(`${this.localApiUrl}/books`, { headers: this.setHeaders() })
  }

  getBookByIb(id: string): Observable<any> {
    return this.http.get(`${this.localApiUrl}/books/search?id=${id}`, { headers: this.setHeaders() })
  }

  getBookByQuery(query: any): Observable<any> {
    const options = { headers: this.setHeaders() }
    return this.http.post(`${this.localApiUrl}/books/search`, query, options)
  }

  addBook(book): Observable<any> {
    const options = { headers: this.setHeaders() }
    return this.http.post(`${this.localApiUrl}/books/post`, book, options);
  }

  setHeaders() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': 'bad18eba1ff45jk7858b8ae88a77fa30'
    });
    return headers;
  }

  getAttributes() {
    return forkJoin(
      this.http.get(`${this.localApiUrl}/companies/`, { headers: this.setHeaders() }),
      this.http.get(`${this.localApiUrl}/countries/`, { headers: this.setHeaders() }),
      this.http.get(`${this.localApiUrl}/cities/`, { headers: this.setHeaders() }),
      this.http.get(`${this.localApiUrl}/formats/`, { headers: this.setHeaders() })
        .pipe(
          map((params: Array<any>) => params)
        )
    )
  }



  getBookFormat(id: String): Observable<any> {
    return this.http.get(`${this.localApiUrl}/formats/search?id=${id}`, { headers: this.setHeaders() })
  }

  getFormats(): Observable<any> {
    return this.http.get(`${this.localApiUrl}/formats/`, { headers: this.setHeaders() })
  }

}
