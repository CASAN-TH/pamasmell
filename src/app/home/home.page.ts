import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: any = {};
  stations: any = [];

  constructor(private router: Router, private homeService : HomeService, private geolocation: Geolocation) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude


      try {
        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        if (latLng) {
          const bounds = this.getBounds(latLng, 10000);
          console.log(bounds);
          let poits = `${bounds.southWest.lng},${bounds.southWest.lat},${bounds.northEast.lng},${bounds.northEast.lat}`
          this.homeService.getNearestStationList(poits);
        }
      } catch (error) {

      }
      this.homeService.getHomeDataList(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude

      try {
        let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
        if (latLng) {
          const bounds = this.getBounds(latLng, 10000);
          console.log(bounds);
          let poits = `${bounds.southWest.lng},${bounds.southWest.lat},${bounds.northEast.lng},${bounds.northEast.lat}`
          this.homeService.getNearestStationList(poits);
        }
      } catch (error) {

      }


      this.homeService.getHomeDataList(data.coords.latitude, data.coords.longitude);
    });

    this.homeService.onHomeDataListChanged.subscribe((homeDataList:any)=>{
      console.log(homeDataList);
      this.data = homeDataList;
    })

    this.homeService.onNearestStationListChanged.subscribe((data: any) => {
      console.log(data);
      this.stations = data;
    })
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
        lng: northEast.lng(),
      },
      southWest: {
        lat: southWest.lat(),
        lng: southWest.lng(),
      },
    };
  }

}
