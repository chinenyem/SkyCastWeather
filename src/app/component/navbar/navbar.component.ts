import { Component, OnInit } from '@angular/core';
import { AngularFire} from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import {MomentModule} from 'angular2-moment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  displayName:string;
  todays_date:any;

  constructor(
    public af:AngularFire,
    public flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {

    this.todays_date = new Date();

    //console.log(this.af.auth.subscribe(auth => console.log(auth)))
      this.af.auth.subscribe(auth => {
          if (auth != null){
            let fullName = auth.google.displayName
            this.displayName = fullName.split(' ')[0]
          }
        });
  }

  login(){
    this.af.auth.login();
    this.flashMessage.show('You are logged in',
                          {cssClass:'alert-success', timeout:3000}
                        );
  }

  logout(){
    this.af.auth.logout();
    this.flashMessage.show('You are logged out',
                          {cssClass:'alert-success', timeout:3000}
                        );
  }

}
