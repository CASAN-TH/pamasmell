import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

const api_url = "https://pm2dot5-aie.herokuapp.com";
const mockup = environment.mockup;

@Injectable({
  providedIn: "root"
})
export class HomeService {
  routeParams: any;

  onLocationChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onHomeDataListChanged: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  onNearestStationListChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  private authorizationHeader() {
    const token = window.localStorage.getItem(`token@${environment.appName}`);
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);

    return headers;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    // this.routeParams = route.params;
    // console.log("resolve with params : " + JSON.stringify(this.routeParams));
    // this.getHomeDataList('13.940848899999999','100.7156547');
    return;
  }

  getHomeDataList(lat, lng): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.http.get(`${api_url}/api/cities/${lat}/${lng}`).subscribe(
        (res: any) => {
          this.onHomeDataListChanged.next(res.data);
        },
        err => {
          console.log("error : " + JSON.stringify(err));
        }
      );
    });
  }

  // getNearestStationList(poits): Observable<any> | Promise<any> | any {
  //   //  southWest : {lat: 13.985745564205976, lng: 100.7619637076242}
  //   return new Promise((resolve, reject)=>{
  //     this.http.get(`${api_url }/api/stations?points=${poits}`  ).subscribe((res: any) => {
  //       this.onNearestStationListChanged.next(res.data);
  //     }, (err) => {
  //       console.log('error : ' + JSON.stringify(err))
  //     })
  //   });
  // }

  getNearestStationList(lat, long): Observable<any> | Promise<any> | any {
    //  southWest : {lat: 13.985745564205976, lng: 100.7619637076242}
    return new Promise((resolve, reject) => {
      this.http.get(`${api_url}/api/stations/${lat}/${long}`).subscribe(
        (res: any) => {
          this.onNearestStationListChanged.next(res.data);
        },
        err => {
          console.log("error : " + JSON.stringify(err));
        }
      );
    });
  }
}
