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

import { LoadingController } from '@ionic/angular';
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
    private loadingController: LoadingController,
    private router: Router,
    private homeService: HomeService,
    private geolocation: Geolocation,
    private platform: Platform
  ) {}

  loadMap() {
    // console.log(data);
    var data = JSON.parse(
      window.localStorage.getItem(`coords@${environment.appName}`)
    );
    
    let initialPos = { lat: data.coords.latitude, lng: data.coords.longitude };

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: initialPos,
        zoom: 14,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create("map_canvas", mapOptions);

    // let marker: Marker = this.map.addMarkerSync({
    //   title: "Ionic",
    //   icon: "blue",
    //   animation: "DROP",
    //   position: initialPos
    // });
  }

  addMarker() {
    this.map.clear();
    var coords = JSON.parse(
      window.localStorage.getItem(`coords@${environment.appName}`)
    );

    if (coords.coords) {
      console.log(this.stations);
      let initialPos = {
        lat: coords.coords.latitude,
        lng: coords.coords.longitude
      };
      this.map.moveCamera({
        target: initialPos,
        // zoom: 12,
        // tilt: 30
      });

      let marker: Marker = this.map.addMarkerSync({
        title: "Me",
        icon: "blue",
        // animation: "DROP",
        position: initialPos
      });
    }
    this.stations.forEach((station: any) => {
      var bg =
        station.aqi < 26
          ? "a8e05f"
          : station.aqi < 51
          ? "a8e05f"
          : station.aqi < 101
          ? "fdd74b"
          : station.aqi < 201
          ? "fe9b57"
          : "fe6a69";
      const icon = {
        url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${station.aqi}`,
        size: { width: 36, height: 36 }
      };
      let marker: Marker = this.map.addMarkerSync({
        title: station.name,
        icon: icon,
        // animation: "DROP",
        position: { lat: station.latitude, lng: station.longitude }
      });
    });
  }

  // ngAfterViewInit() {
  //   this.geolocation
  //     .getCurrentPosition()
  //     .then(data => {
  //       this.loadMap();
  //       this.homeService.onLocationChanged.next(data);
  //     })
  //     .catch(error => {
  //       console.log("Error getting location", error);
  //     });

  //   let watch = this.geolocation.watchPosition();
  //   watch.subscribe(data => {
  //     this.homeService.onLocationChanged.next(data);
  //   });
  // }

  async ngOnInit() {
    
    this.homeService.onLocationChanged.subscribe(async (data: any) => {
      // this.loadMap();
      // console.log(this.map);
      if(!this.map){
        
        this.loadMap();
        
      }
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
      // console.log(homeDataList);
      this.data = homeDataList;
    });

    this.homeService.onNearestStationListChanged.subscribe((data: any) => {
      // console.log(data);
      if (data && data.length > 0) {
        this.stations = data;
        this.addMarker();
      }
    });

    // this.getData();
  }

  async getData() {
    
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
