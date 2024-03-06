import { Component } from '@angular/core';
import { CycleServiceService } from './services/cycle-service.service';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';

  constructor(public cycle: CycleServiceService, private api: ApiService, private store: StorageService){

  }

  //since app component is the very first component to render after reload , it will send the stored token to the user behaviour subject in the api service 
  ngOnInit() {

    const epoch = new Date().getTime() /1000
    console.log("Current Time:", this.api.getToken().exp)
    console.log("Epoch Time: ", epoch)
    
    if (this.api.getToken().exp < epoch ) {
      this.api.logOut()
      this.api.expMessage("Session Has Expired")
    }
    this.store.getItem('Token')
    this.api.MaintainUser(this.store.getItem('Token'))
    //console.log("TOKEN", this.api.MaintainUser(this.store.getItem('Token')))
  }

}
