import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "./home.service";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { environment } from "src/environments/environment";
declare var google;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  data: any = {};
  stations: any = [];
  distance = 15000;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.homeService.onLocationChanged.subscribe((data: any) => {
      if (data.coords) {
        var coords = {
          coords: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
          }
        };
        window.localStorage.setItem(
          `coords@${environment.appName}`,
          JSON.stringify(coords)
        );
        this.getData();
      }
    });

    this.homeService.onHomeDataListChanged.subscribe((homeDataList: any) => {
      console.log(homeDataList);
      this.data = homeDataList;
    });

    this.homeService.onNearestStationListChanged.subscribe((data: any) => {
      console.log(data);
      if (data && data.length > 0) {
        this.stations = data;
      }
    });

    this.geolocation
      .getCurrentPosition()
      .then(data => {
        this.homeService.onLocationChanged.next(data);
      })
      .catch(error => {
        console.log("Error getting location", error);
      });

    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      this.homeService.onLocationChanged.next(data);
    });

    this.getData();
  }

  getData() {
    var coords = JSON.parse(
      window.localStorage.getItem(`coords@${environment.appName}`)
    );

    if (coords.coords) {
      var data = coords;
      try {
        let latLng = new google.maps.LatLng(
          data.coords.latitude,
          data.coords.longitude
        );
        // console.log(latLng);
        if (latLng) {
          const bounds = this.getBounds(latLng, this.distance);
          // console.log(bounds);
          let poits = `${bounds.southWest.lng},${bounds.southWest.lat},${bounds.northEast.lng},${bounds.northEast.lat}`;
          this.homeService.getNearestStationList(poits);
        }
      } catch (error) {
        console.log(error);
      }

      this.homeService.getHomeDataList(
        data.coords.latitude,
        data.coords.longitude
      );
    }
  }

  getBounds(latLng, radius) {
    const circle = new google.maps.Circle({
      center: latLng,
      radius: radius
    });
    const bounds = circle.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    return {
      northEast: {
        lat: northEast.lat(),
        lng: northEast.lng()
      },
      southWest: {
        lat: southWest.lat(),
        lng: southWest.lng()
      }
    };
  }

  doRefresh(event) {
    console.log("Begin async operation");
    this.getData();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }
}
