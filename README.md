# SkyCastWeather (Made with AngluarCli, AngularJS2, Firebase, Highcharts, Bootstrap)
View the app here https://skycast-e9d0e.firebaseapp.com/


This is a small SkyCast project for a viewing weather information. This is a stable base to iterate weather data information from. Leverging the Google API and APIXU weather api users are able to pick a place, view that specifc place current weather, next 4 days of weather and yesterdays' weather(historic data). User can log in with google authentication, using their gmail account. If logged, each searched place is saved in the database. The user can choose which place they searched in the past and view information about it. Also a qoute api is used to give quote of the day inspirations to the user. 

The design is a modern dark design with vibrant charts, images, and serif font.

The web application is made with angluarjs2(javascript framework), firebase(database, hosting, and authentication), highcharts(historic
weather charts), bootstrap, google api(autocomplete search), apixu api(weather information), angulartesting, angularCli(compiling files for production).

# Javascript Framework
AngularJS2

# Testing
Angular Testing Module

# Resource Compiling
AngularCli ng-build


I did not use DarkSky api because it required I needed SSL cert to make calls to its api. I don't have one using my localhost. I decided to venture out and find another weeather api!










This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
