import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { DarkskyService } from '../../service/darksky.service';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-weather-lookups',
  templateUrl: './weather-lookups.component.html',
  styleUrls: ['./weather-lookups.component.css']
})
export class WeatherLookupsComponent implements OnInit {
  //create variables
  weatherLookups:any;
  place:any;
  //today temps variables
  today_current_temp: any;
  today_cloud: any;
  today_feels_like: any;
  today_current_condition_icon: any;
  today_current_text:any;
  today_current_humidity:any;
  today_current_visibility: any;
  today_current_wind_degree: any;
  today_current_wind_direction: any;
  today_current_pressure_in:any;
  today_current_precipitation_in:any;
  quote_of_the_day:any;
  author:any;
  yesterday:any;
  //forecast days temps variable
  forecastdays
  //hourly temps variable
  hourly_temp:any;
  hourly_dew:any;
  hourly_wind:any;
  hourly_wind_chill:any;
  hourly_precip_in:any;
  hourly_pressure_in:any;
  tempDewpoint:any;
  windSpeed:any;
  windDirection:any;
  precipTotal:any;
  pressureTotal:any;


  constructor(
      //access services
      private firebaseService:FirebaseService,
      private darkskyService: DarkskyService,
      public af:AngularFire

    ) { }

  ngOnInit() {
    //set defaults
    this.place = "Henry, SC";
    this.quote_of_the_day = "My mission in life is not merely to survive, but to thrive;\
                            and to do so with some passion, some compassion, some humor,\
                            and some style.";
    this.author = "Maya Angelou";
    this.today_cloud = 4;
    this.today_current_temp = 70;
    this.today_feels_like = 70;
    this.today_current_condition_icon = 'http://cdn.apixu.com/weather/64x64/day/116.png';
    this.today_current_text = 'Partly Cloudy';
    this.today_current_humidity = 33;
    this.today_current_visibility = 10;
    this.today_current_wind_degree = 7;
    this.today_current_wind_direction = 'N';
    this.today_current_pressure_in = 30;
    this.today_current_precipitation_in = 47;


    //Get yesterday's date
    let todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate()-1);
    this.yesterday =  todaysDate.getFullYear()  + '-' + (todaysDate.getMonth()+1) + '-' + todaysDate.getDate();


    //get logged in user saved weather searches
   // instiating the service function to make an http get request to
   // get logged in user saved weather searchs
    //Input : string userId
    //Return : array of weather data objects
    this.af.auth.subscribe(auth => {
      if (auth != null){
        let userId = auth.uid;
          this.firebaseService.getWeatherLookups(userId).subscribe(weatherLookups => {
            this.weatherLookups = weatherLookups;
          });
      }
    });
  }

  //get weather data from click method
 // instiating the service functions to make an http get requests to weather api,
 //pass in string lat, and string long values from html template
  //Input :string latitude, string longitude
  //Return : data

  lookupWeather(lat, log, place){
    //get place name
    this.place = place;

    //get quote
   // instiating the service function to make an http get request to get
   //quote of the day
    //Input : nothing
    //Return : object
    this.darkskyService.getQuoteOfTheDay().subscribe(data =>{
      this.quote_of_the_day = data.text;
      this.author = data.author.name;
    });

    //get current weather data
   // instiating the service function to make an http get request to weather api for
   //current weather data
    //Input :string latitude, string longitude
    //Return : json
    this.darkskyService.getCurrentWeatherData
     (
       lat,
       log
     ).subscribe(data =>{
         this.today_cloud = data.current.cloud;
         this.today_current_temp = data.current.temp_f;
         this.today_feels_like = data.current.feelslike_f;
         this.today_current_condition_icon = data.current.condition.icon;
         this.today_current_text = data.current.condition.text;
         this.today_current_humidity = data.current.humidity;
         this.today_current_visibility = data.current.vis_miles;
         this.today_current_wind_degree = data.current.wind_degree;
         this.today_current_wind_direction = data.current.wind_dir;
         this.today_current_pressure_in = data.current.pressure_in;
         this.today_current_precipitation_in = data.current.precip_in;
     });

     //4 days of forecast data
    // instiating the service function to make an http  get request to weather api for
    // 4 days of forecast data
     //Input :string latitude, string longitude
     //Return : Array of data objects
     this.darkskyService.getForecastWeatherData
     (
       lat,
       log
     ).subscribe(data =>{
         this.forecastdays = data.forecast.forecastday
     });



     //Get Yesterday's Weather
    // instiating the service function to make an http get request to weather api for
    //historic data
     //Input :string latitude, string longitude,  string yesterday's date
     //Return : Array of data objects, build charts with data
     this.darkskyService.getHistoricWeatherData
     (
       lat,
       log,
       this.yesterday
     ).subscribe(data =>{
         let hourlyArray = data.forecast.forecastday[0].hour;
         this.hourly_temp = []
         this.hourly_dew = []
         this.hourly_wind = []
         this.hourly_wind_chill = []
         this.hourly_precip_in = []
         this.hourly_pressure_in = []
         for (var i = 0; i < hourlyArray.length; i++){
             this.hourly_temp.push(hourlyArray[i].temp_f);
             this.hourly_dew.push(hourlyArray[i].dewpoint_f);
             this.hourly_wind.push(hourlyArray[i].wind_mph);
             this.hourly_wind_chill.push(hourlyArray[i].windchill_f);
             this.hourly_precip_in.push(hourlyArray[i].precip_in);
             this.hourly_pressure_in.push(hourlyArray[i].pressure_in);

         }
         //Create charts from variable arrays using Highchartsjs chart library
         //Chart 1
         this.tempDewpoint = {
             title : {
               text : 'Temperature & Dew Point',
               color: '#000000'
             },
             chart: {
               backgroundColor: '#2AA198',
               width: 1300,
               style: {
                  fontFamily: 'serif'
              }
             },
             yAxis: {
              title: {
                  text: 'Percent(%)'
                },
                labels: {
                    style:{
                      color: '#ffeb3b'
                    },
                    formatter: function () {
                        return this.value + "%";
                    }
                }
              },
              xAxis: {
               title: {
                   text: 'Hours'
                 },
                 labels: {
                   style:{
                     color: '#ffeb3b'
                   },
                     formatter: function () {
                         return this.value + "h";
                     }
                 }
               },
               legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },
               plotOptions: {
                  series: {
                      pointStart: 1
                  }
              },
             series: [
               { name : 'Temperature', data: this.hourly_temp },
               { name : 'Dew Point',  data: this.hourly_dew }
             ]
         };

         //Chart 2
         this.windSpeed = {
             title : {
                text : 'Wind Speed & Wind Chill',
                color: '#000000'
               },
             chart: {
               backgroundColor: '#2AA198',
               width: 1300,
               style: {
                  fontFamily: 'serif'
              }
             },
             yAxis: {
              title: {
                  text: 'Value(mph)'
                },
                labels: {
                  style:{
                    color: '#ffeb3b'
                  },
                    formatter: function () {
                        return this.value + "mph";
                    }
                }
              },
              xAxis: {
               title: {
                   text: 'Hours'
                 },
                 labels: {
                   style:{
                     color: '#ffeb3b'
                   },
                     formatter: function () {
                         return this.value + "h";
                     }
                 }
               },
               legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },
               plotOptions: {
                  series: {
                      pointStart: 1
                  }
              },
             series: [
               { name : 'Wind Speed', data: this.hourly_wind },
               { name : 'Wind Chill',  data: this.hourly_wind_chill }
             ]
         };

         //chart 3
         this.precipTotal = {
             title : {
                text : 'Precipitation Accum Total(in)',
                color: '#000000'
              },
             chart: {
               backgroundColor: '#2AA198',
               width: 1300,
               style: {
                  fontFamily: 'serif'
              }
             },
             yAxis: {
              title: {
                  text: 'Value(inches)'
                },
                labels: {
                  style:{
                    color: '#ffeb3b'
                  },
                    formatter: function () {
                        return this.value + "in";
                    }
                }
              },
              xAxis: {
               title: {
                   text: 'Hours'
                 },
                 labels: {
                   style:{
                     color: '#ffeb3b'
                   },
                     formatter: function () {
                         return this.value + "h";
                     }
                 }
               },
               legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },
               plotOptions: {
                  series: {
                      pointStart: 1
                  }
              },
             series: [
               { name : 'Precipitation Total(in)', data: this.hourly_precip_in }
             ]
         };

         //chart 4
         this.pressureTotal = {
           title : {
              text : 'Pressure',
              color: '#000000'
            },
           chart: {
             backgroundColor: '#2AA198',
             width: 1300,
             style: {
                fontFamily: 'serif'
            }
           },
           yAxis: {
            title: {
              style:{
                color: '#ffeb3b'
              },
                text: 'Value(in)'
              },
              labels: {
                  formatter: function () {
                      return this.value + "in";
                  }
              }
            },
            xAxis: {
             title: {
                 text: 'Hours'
               },
               labels: {
                 style:{
                   color: '#ffeb3b'
                 },
                   formatter: function () {
                       return this.value + "h";
                   }
               }
             },
             legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
             plotOptions: {
                series: {
                    pointStart: 1
                }
            },
           series: [
             { name : 'Pressure Total(in)', data: this.hourly_pressure_in }
           ]
         };


     });

  }

}
