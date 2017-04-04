declare var require: any
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import { AngularFireModule,  AuthProviders, AuthMethods  } from 'angularfire2';
import { FirebaseService } from './service/firebase.service';
import { DarkskyService } from './service/darksky.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AgmCoreModule, MapsAPILoader } from "angular2-google-maps/core";
import { MomentModule } from 'angular2-moment';
import { ChartModule } from 'angular2-highcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Ng2FilterPipeModule } from 'ng2-filter-pipe';


export const firebaseConfig = {
  apiKey: "AIzaSyDJVT_jpKoKBZgEJmqN7jmiJvHbnBRc1wo",
  authDomain: "skycast-e9d0e.firebaseapp.com",
  databaseURL: "https://skycast-e9d0e.firebaseio.com",
  storageBucket: "skycast-e9d0e.appspot.com",
  messagingSenderId: "524115308072"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};


import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { WeatherLookupsComponent } from './component/weather-lookups/weather-lookups.component';


const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'weather-lookups', component:WeatherLookupsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    WeatherLookupsComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCIBUfvzwpl4vec2lSiUzx_GZeLpZ-57eQ",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    Ng2SearchPipeModule,
    Ng2FilterPipeModule,
    MomentModule,
    ChartModule.forRoot(require('highcharts')),
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [FirebaseService, DarkskyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
