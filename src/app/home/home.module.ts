import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';


import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [Geolocation, GoogleMaps]
})
export class HomePageModule { }
