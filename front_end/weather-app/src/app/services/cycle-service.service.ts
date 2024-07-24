import { Injectable } from '@angular/core';
import { interval, map, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CycleServiceService {


// Time that checks the hour of the day, every minute, setting appropriate background of app (style.css)
  theme$ = interval(60_000).pipe(
    startWith('Starting timer'),
// tap(data => console.log('theme$', data)),
    map(data => {
      const currentTime = new Date().getHours();

        if (currentTime >= 6 && currentTime < 10) {
          this.CSSclass = 'morning'   
        } else if (currentTime >= 10 && currentTime < 15) {
            this.CSSclass = 'midday'
        } else if (currentTime >= 15 && currentTime < 18) {
            this.CSSclass = 'afternoon'
        } else {
            this.CSSclass = 'night'
        }
        return this.CSSclass

    }))

  CSSclass: string = "";
  constructor() { }

}


