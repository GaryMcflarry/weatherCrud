import { Injectable } from '@angular/core';
import { interval, map, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CycleServiceService {

  login: any = undefined

  theme$ = interval(60_000).pipe(
    startWith('Starting timer'),
    tap(data => console.log('theme$', data)),
    map(data => {
      const currentTime = new Date().getHours();
      // Add a class to the body based on the current time
      // body.clascardCsssList.add(CSSclass)
      if (this.login == true) {
        if (currentTime >= 6 && currentTime < 10) {
          this.CSSclass = 'morning-L'   
        } else if (currentTime >= 10 && currentTime < 15) {
            this.CSSclass = 'midday-L'
        } else if (currentTime >= 15 && currentTime < 18) {
            this.CSSclass = 'afternoon-L'
        } else {
            this.CSSclass = 'night-L'
        }
        return this.CSSclass
      } else {
        if (currentTime >= 6 && currentTime < 10) {
          this.CSSclass = 'morning'   
        } else if (currentTime >= 10 && currentTime < 15) {
            this.CSSclass = 'midday'
        } else if (currentTime >= 15 && currentTime < 18) {
            this.CSSclass = 'afternoon'
        } else {
            this.CSSclass = 'night'
        }
      // }
      console.log("current hour: ", currentTime)
      // console.log("Fetched hour: ", hour)
      console.log("CSS: " , this.CSSclass)
      return this.CSSclass
    }
  })
  )

  CSSclass: string = "";
  constructor() { }

  
}

  // getData(action: string, data: Object) {
  //   console.log('Action', action)
  //   console.log('data', data)

  //   // data.key = 'XXXXXXX'
  //   const dataObjectToSend = {...data, key: 'cd24f9073d024cc2b3a82758242501'}
  //   console.log('dataObjectToSend', dataObjectToSend)

  // }


