import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const api_url = "https://pm2dot5-aie.herokuapp.com";

@Injectable({
  providedIn: "root"
})
export class NotifyService {
  routeParams: any;
  ongetNotifyData: BehaviorSubject<any> = new BehaviorSubject({});
  onHomeDataListChanged: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  onHistoriesDataListChanged: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.getNotifyData();
    // return;
  }

  getNotifyData(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.http.get(`${api_url}/api/mychild`).subscribe(
        (res: any) => {
          this.ongetNotifyData.next(res.data);
          this.getHomeDataList(res.data.latitude,res.data.longitude);
          this.getHistoriesDataList();
        },
        err => {
          console.log("error : " + JSON.stringify(err));
        }
      );
    });
  }

  getHomeDataList(lat,lng): Observable<any> | Promise<any> | any {
    this.http.get(`${api_url }/api/cities/${lat}/${lng}`  ).subscribe((res: any) => {
        this.onHomeDataListChanged.next(res.data);
      }, (err) => {
        console.log('error : ' + JSON.stringify(err))
      })
  }

  getHistoriesDataList(): Observable<any> | Promise<any> | any {
    this.http.get(`${api_url }/api/history`  ).subscribe((res: any) => {
        this.onHistoriesDataListChanged.next(res.data);
      }, (err) => {
        this.onHistoriesDataListChanged.next({
        // ข้อมูลภายในแผนภูมิแบบเส้น
        labels: [
          "6 ",
          "7 ",
          "8 ",
          "9 ",
          "10 ",
          "11 ",
          "12 ",
          "13 ",
          "14 ",
          "15 ",
          "16 ",
          "17 "
        ], // ชื่อของข้อมูลในแนวแกน x
        datasets: [
          {
            // กำหนดค่าข้อมูลภายในแผนภูมิแบบเส้น
            label: "PM2.5",
            data: [60, 61, 66, 65, 72, 60, 59, 59, 59, 60, 50, 55],
            fill: false,
            lineTension: 0.2,
            borderColor: "green", // สีของเส้น
            borderWidth: 1
          }
        ]
      });
      })
  }
}
