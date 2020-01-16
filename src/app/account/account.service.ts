import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const api_url = "https://pm2dot5-aie.herokuapp.com";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  routeParams: any;
  onPostDataListChanged: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.getPostDataList();
    // return;
  }

  getPostDataList(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.http.get(`${api_url}/api/post`).subscribe(
        (res: any) => {
          this.onPostDataListChanged.next(res.data);
        },
        err => {
          console.log("error : " + JSON.stringify(err));
        }
      );
    });
  }
}
