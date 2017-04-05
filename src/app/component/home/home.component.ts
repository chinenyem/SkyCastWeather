import { Component, OnInit, ElementRef, NgZone, ViewChild  } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService  } from 'angular2-flash-messages';
import { FormControl } from "@angular/forms";
import { DarkskyService } from '../../service/darksky.service';
import { FirebaseService } from '../../service/firebase.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //create variables
   latitude: number;
   longitude: number;
   latitude_darksky: number;
   longitude_darksky: number;
   place:string;
   user_id:string;
   searchControl: FormControl;
   zoom: number;
   google: any;
   items:any;
   location:any;


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
   yesterday:any;


   //create referece to seach template variable for search string values
  @ViewChild("search") public searchElementRef: ElementRef;



  constructor(
    //access services
    public af:AngularFire,
    private darkskyService: DarkskyService,
    private firebaseService:FirebaseService,
    public flashMessage: FlashMessagesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,


  ) {}

  ngOnInit() {
    //set google maps defaults
    this.place = "Henry, SC";
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //set today weather defaults
    this.quote_of_the_day = "My mission in life is not merely to survive, but to thrive;\
                            and to do so with some passion, some compassion, some humor,\
                            and some style."
    this.author = "Maya Angelou"
    this.today_cloud = 4;
    this.today_current_temp = 70;
    this.today_feels_like = 70;
    this.today_current_condition_icon = 'https://cdn.apixu.com/weather/64x64/day/116.png';
    this.today_current_text = 'Partly Cloudy';
    this.today_current_humidity = 33;
    this.today_current_visibility = 10;
    this.today_current_wind_degree = 7;
    this.today_current_wind_direction = 'N';
    this.today_current_pressure_in = 30;
    this.today_current_precipitation_in = 47;

    //get yesterday's date
    let todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate()-1);
    this.yesterday =  todaysDate.getFullYear()  + '-' + (todaysDate.getMonth()+1) + '-' + todaysDate.getDate();



    //create search FormControl
   this.searchControl = new FormControl();

   //get Current Position latitude and longitude
   this.setCurrentPosition()



   //get load map, and get weather data
  // instiating the service functions to make an http get requests to weather api
   //Input : nothing
   //Return : string latitude, string longitude
     this.mapsAPILoader.load().then(() => {


       //google api autocomplete method
      // on key up of pass in searched element string from
      // this.searchElementRef.nativeElement
      //pass in string lat, and string long values from html template
       //Input :string place
       //Return: nothing
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
         types: ["address"]
       });


       //google api autocomplete listener method
      // on key up of pass in searched element string from
      // this.searchElementRef.nativeElement
      //pass in string lat, and string long values from html template
       //Input :string place
       //Return: map location, and string longitude, string latitude
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
           this.latitude_darksky = place.geometry.location.lat();
           this.longitude_darksky = place.geometry.location.lng();
           this.place = place.formatted_address;
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }

           //set latitude, longitude and zoom on google map
           this.latitude = place.geometry.location.lat();
           this.longitude = place.geometry.location.lng();
           this.zoom = 12;

           //save logged in user  weather searches
          // instiating the service function to make an http put request to
          // save logged in user weather searchs
           //Input : string longitude, string latitude, string place, string date
           //Return : success message
           this.af.auth.subscribe(auth => {
               if (auth != null){
                 let getDate = new Date(),
                     formatDate = (getDate.getMonth() + 1) + '/' + getDate.getDate() + '/' +  getDate.getFullYear();
                 let userId = auth.uid;
                 let weatherData = {
                     longitude: this.longitude_darksky,
                     latitude: this.latitude_darksky,
                     place: place.formatted_address,
                     date: formatDate
                 }
                 this.firebaseService.addWeatherDataLookup(weatherData, userId);
                 this.flashMessage.show('Your weather lookup is saved',{cssClass:'alert-success', timeout:3000});

               }
            });

            //get quote
           // instiating the service function to make an http get request to get
           //quote of the day
            //Input : nothing
            //Return : object
           this.darkskyService.getQuoteOfTheDay().subscribe(data =>{
             console.log(data)
             this.quote_of_the_day = data.text;
             this.author = data.author.name;
           });


           //get current weather data
          // instiating the service function to make an http get request to weather api  and
          //subscriber to promise retrieving current weather data
           //Input :string latitude, string longitude
           //Return : json
           this.darkskyService.getCurrentWeatherData
            (
              this.latitude_darksky,
              this.longitude_darksky
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
           // instiating the service function to make an http  get request to weather api
           //and subscriber to promise retrieving  4 days of forecast data
            //Input :string latitude, string longitude
            //Return : Array of data objects
            this.darkskyService.getForecastWeatherData
            (
              this.latitude_darksky,
              this.longitude_darksky
            ).subscribe(data =>{
                this.forecastdays = data.forecast.forecastday
            });


            //Get Yesterday's Weather
           // instiating the service function to make an http get request to weather api, and subscrbe
           // to promise retrieving to for historic data
            //Input :string latitude, string longitude,  string yesterday's date
            //Return : Array of data objects, build charts with data
            this.darkskyService.getHistoricWeatherData
            (
              this.latitude_darksky,
              this.longitude_darksky,
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

           //verify result
          //  if (place.geometry === undefined || place.geometry === null) {
          //    return;
          //  }

           //set latitude, longitude and zoom
          //  this.latitude = place.geometry.location.lat();
          //  this.longitude = place.geometry.location.lng();
          //  this.zoom = 12;
         });
       });


     });


  }

  //set current position of map with persons latitude, and longitude
  setCurrentPosition(){
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 18;
        });
      }

  }


}
