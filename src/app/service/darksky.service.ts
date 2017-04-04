import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';


//use injectable module to data into components
@Injectable()
export class DarkskyService {
  //create key string
  key:string

  //utilize http method
  constructor(
    private http: Http,

  ) {
    this.key = 'c51a5ffecc1841a88d9232648173103'
  }
  //changed from darksky api to apixu api because I would need a signed SSL cert to get data
  //from darksky

  //Input: nothing
  //Return: quote json
  // make a get request to quote api
  //maps out results and from the response gives json
  getQuoteOfTheDay(){
    let url = 'http://www.quotzzy.co/api/quote';
    return this.http.get(url).map((res:Response) => res.json());
  }

  //Input: string latitude, string longitude
  //Return: weather data object
  //create url with givien strings
  // make a get request to weather api
  //maps out results and from the response gives json
  getCurrentWeatherData(latitude, longitude){
    let latitude_data = latitude,
        longitude_data = longitude;
    let url = 'https://api.apixu.com/v1/current.json?key=' + this.key + '&q=' + latitude_data + ',' + longitude_data;
    return this.http.get(url).map((res:Response) => res.json());
  }

  //Input: string latitude, string longitude
  //Return: weather data object
  //create url with givien strings
  // make a get request to weather api
  //maps out results and from the response gives json
  getForecastWeatherData(latitude, longitude){
    let latitude_data = latitude,
        longitude_data = longitude;
    let url = 'https://api.apixu.com/v1/forecast.json?key=' + this.key + '&q=' + latitude_data + ',' + longitude_data + '&days=4';
    return this.http.get(url).map((res:Response) => res.json());
  }

  //Input: string latitude, string longitude, string pastdate
  //Return: weather data object
  //create url with givien strings
  // make a get request to weather api
  //maps out results and from the response gives json
  getHistoricWeatherData(latitude, longitude, yesterday){
    let latitude_data = latitude,
        longitude_data = longitude,
        pastDate_data = yesterday;
    let url = 'https://api.apixu.com/v1/history.json?key=' + this.key + '&q=' + latitude_data + ',' + longitude_data + '&dt=' + pastDate_data;
    return this.http.get(url).map((res:Response) => res.json());
  }

}
