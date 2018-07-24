import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, of } from 'rxjs';
import { map, share, tap, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  private data: any;
  private observable: Observable<any>;

  constructor(private http: HttpClient) {}

  getStaticData(url): Observable<any> {
    if (this.data) {
      return of(this.data);
    } else if (this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
      this.observable = this.http.get(url).pipe(
        map((res: Observable<any>) => this.updateData(res)),
        tap(() => this.observable = null),
        share()
      );
      return this.observable;
    }
  }

  updateData(data: Observable<any>): Observable<any> {
    this.data = new Observable(observer => {
      observer.next(data);
      observer.complete();
    });
    return this.data;
  }

  pollingData(url, httpInterval): Observable<any> {
    const updatedData = this.http.get(url).pipe(
      map((response: Observable<any>) =>  this.updateData(response)),
      share()
    );
    return timer(0, httpInterval).pipe(concatMap(() => updatedData));
  }
}
