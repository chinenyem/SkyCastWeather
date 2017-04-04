import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';

//use injectable module to data into components
@Injectable()
export class FirebaseService {
  //create typescript array variable type
  weatherLookups: FirebaseListObservable<any[]>

  //utilize angularfire service
  constructor(
    private af: AngularFire
  ) {
    this.weatherLookups = this.af.database.list('/weather_lookups') as FirebaseListObservable<WeatherLookups[]>
  }

  //Get weather lookups from firebase Nosql database
  //Input: user id string
  //Return: array of objects of weather data for that specific user
  getWeatherLookups(userId){
    this.weatherLookups = this.af.database.list('/weather_lookups/' + userId) as FirebaseListObservable<WeatherLookups[]>
    return this.weatherLookups;
  }


  //Save weather data to firebase NoSql database
  //Input: weatherdata object and string userId
  //Return: nothing
  addWeatherDataLookup(weatherData, userId){
    this.weatherLookups = this.af.database.list('/weather_lookups/' + userId) as FirebaseListObservable<WeatherLookups[]>
    return this.weatherLookups.push(weatherData);
  }

}

//create object
interface WeatherLookups{
  $key?:string;
  longitude?: string;
  latitude?: string;
  user_id?: string;
  place?: string;
  date?: string;
}
