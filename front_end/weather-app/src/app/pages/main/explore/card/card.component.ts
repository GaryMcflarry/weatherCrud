import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { CycleServiceService } from 'src/app/services/cycle-service.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  //injected data
  @Input() data! : string;
  //value that will be injected, but its default is false until stated otherwise
  @Input() canRoute: boolean = false

  bg: string = ""

  constructor(private web: WebRequestService, private date: DatePipe, public cycle: CycleServiceService, private route: Router) {}

  params$ = new  BehaviorSubject<any>('Default')

  //obs for obtaining certian json for card display from api, this call uses the location that was injected
  current$ = this.params$.pipe(
    switchMap((data: any) => {
      return this.web.get('current', data).pipe(
        map((data: any) => {
        const hour = this.date.transform(data.location.localtime, 'HH')
        this.setClass(hour)
          return {
            currentTemp: data.current.temp_c,
            location: data.location.name,
            time: data.location.localtime,
            windSpeed: data.current.wind_kph,
            windDir: data.current.wind_dir,
            condition: data.current.condition.text,
            country: data.location.country 
          };
        }),
        tap((data:any) => {console.log("Current: " , data)}),
      );
    })
  );


  //method used for obtaining the appriopriate class name for the background
  setClass(hour:any) {
    if (hour >= 6 && hour < 10) {
      this.bg = 'morning'   
    } else if (hour >= 10 && hour < 15) {
        this.bg = 'midday'
    } else if (hour >= 15 && hour < 18) {
        this.bg = 'afternoon'
    } else {
        this.bg = 'night'
    }
  }

  //upon render will update the behaviour subject with the injected data (locations name)
  ngOnInit() {
    this.params$.next(this.data);
  }

  //if can rout becomes true the entire card will become a button that will route to a version of weather-display that shows all the info based on the injected location
  router() {
    console.log('route variable', this.canRoute)
    console.log('data variable', this.data)
    this.route.navigate([`/main/explore/${this.data}`])
  }




}
