import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from "@ionic-native/google-maps/ngx";

import { Component, OnInit, ViewChild } from "@angular/core";

import { Router } from "@angular/router";
import { HomeService } from "./home.service";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { environment } from "src/environments/environment";
import { Platform } from "@ionic/angular";
declare var google;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  map: GoogleMap;
  data: any = {};
  stations: any = [];
  distance = 15000;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private geolocation: Geolocation,
    private platform: Platform
  ) {}

  loadMap(data: any) {
    let initialPos = {lat: data.coords.latitude, lng: data.coords.longitude};

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: initialPos,
        zoom: 17,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create("map_canvas", mapOptions);

    var myLocationIcon = {
      path: 'M11 11l1.256 5 3.744-10-10 3.75 5 1.25zm1-11c-5.522 0-10 4.395-10 9.815 0 5.505 4.375 9.268 10 14.185 5.625-4.917 10-8.68 10-14.185 0-5.42-4.478-9.815-10-9.815zm0 18c-4.419 0-8-3.582-8-8s3.581-8 8-8 8 3.582 8 8-3.581 8-8 8z',
      scale: 1,
      fillColor: '#3a84df'
    };

    

    let marker: Marker = this.map.addMarkerSync({
      title: "Ionic",
      icon: myLocationIcon,
      animation: "DROP",
      position: initialPos
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert("clicked");
    });
  }

  // ngAfterViewInit() {
  //   this.platform.ready().then(() => {
  //     this.loadMap();
  //   });

  // }

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
        this.loadMap(coords);
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
