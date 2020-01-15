import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { environment } from "src/environments/environment";
import { HomeService } from './home/home.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private homeService: HomeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.geolocation
        .getCurrentPosition()
        .then(data => {
          // this.loadMap(data);
          
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
            this.homeService.onLocationChanged.next(coords);
          }
        })
        .catch(error => {
          console.log("Error getting location", error);
        });

      let watch = this.geolocation.watchPosition();
      watch.subscribe(data => {
        
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
          this.homeService.onLocationChanged.next(coords);
        }
      });
    });
  }
}
