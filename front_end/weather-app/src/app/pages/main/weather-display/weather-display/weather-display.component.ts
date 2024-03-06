import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { format } from 'date-fns';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { CycleServiceService } from 'src/app/services/cycle-service.service';
import { WebRequestService } from 'src/app/services/web-request.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
//small array to map days of week to index num for forecast obs
const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})


export class WeatherDisplayComponent {
  // time!: any;
  // timeFormatted!: any;
  sidebarVisible!: boolean;
  // time_ = new Date();

  @Input() data! : string;
  @Input() showBackButton : boolean = false
  @Input() addButton : boolean = false
  //observablle that takes note of the routing params
  // params$ = this.userService.user.pipe(
  //   // tap((data) => console.log('Params entered:', data)),
  //   //this is how to add data to an excisting object
  //   map((data) => ({ ...data, area: 123 })),
  //   // tap((data) => console.log('Params entered 2 :', data))
  // );


  //making use of a behaviour subject obs, the way that i am using it is that it is a object that can house a defaut 
  //value but once we add a new value to it (.next('')) it can trigger other observable that can make use of that value
  //These obs can return the edited info (.pipe()) and be use however I see fit
  // either through HTML (*ngIF or *ngFor) ot ts (.subscribe()) 
  params$ = new  BehaviorSubject<any>('')


  // params$ = this.userService.user.pipe(
  //   tap(data => console.log('param data ',data)),
  //   //if the data exists
  //   filter(data => data),
  //   map(data => {
  //     return data.locations[this.swiperEl.nativeElement.swiper.activeIndex];
  //   })


  //obsevable that takes info of another and edits it's data
  //obs(observable) that deals with the current call to the api
  current$ = this.params$.pipe(
    //switchmap takes data from other pipe and allows to alter its data
    switchMap((data: any) => {
      return this.web.get('current', data).pipe(
        //tap allows one to show the stream of data that flows through a pipe
        //tap((data: any) => console.log("Unedited Current:", data)),
        // map allows one to take the data from a tap and alter it
        map((data: any) => {
          //returning data  so that tap is now showing certian things
          return {
            currentTemp: data.current.temp_c,
            location: data.location.name,
            time: data.location.localtime,
            isSunny: data.current.condition == 'Sunny',
            condition: data.current.condition.text,
          };
        }),
        //tap((data:any) => {console.log("Current: " , data)})
      );
    })
  );
  
  //obs(observable) that deals with the forecast call to the api
  forcast$ = this.params$.pipe(
    switchMap((data: any) => {
      return this.web.get('forecast', data).pipe(
        //javascript makes use of shallow copies not hollow copies
        //shallow being that it always make use of referencing data and always remaining up to date, hollow being the oppisite
        //thus JSON.parse(JSON.stringify(data)) being used to simulate the a hollow copy to show myself some progress 
        //tap((data: any) => console.log("Unedited Forecast:", JSON.parse(JSON.stringify(data)))),
        map((data: any) => {

          const firstForecastDay = data.forecast.forecastday[0];
          //checking if the forecast days array is not null
          if (firstForecastDay) {
            //altering each element in the array to only display things that i need
            data.forecast.forecastday.forEach((element:any) => {
                  //determining array num from epoch to map it to the daysoftheweek array to display the current days of week
                  //epoch is amount of seconds from 1 Jan 1970, used to determine current day information
                	element.label = daysOfWeek [new Date(element.date_epoch * 1000).getDay()]
                  //taking the hours array from the unedited forecast obs and making a new array that only contains neccesary info
                  //taking info from every element and checking whether the current time has already surpassed its allocated time
                  const filter = element.hour.filter((x: any) => {
                    // console.log('console',data.current.last_updated)
                    // console.log('x',x)
                    // if false then we will not include the element in our hoursData array
                    return x.time > data.current.last_updated
                  })
                  // console.log('dum', filter)
                  //taking the filltered data and putting the neccesary data into the hoursData array
                  element.hoursData = filter.map((hour: any) => {
                    // console.log('console',data.current.last_updated)
                    // if (hour.time > data.current.last_updated) {
                      return {
                        fhourTime: hour.time,
                              ftemp: hour.temp_c,
                              fImage: hour.condition.icon,
                              fPrecip: hour.chance_of_rain
                      }
                    // } else {
                      
                    // }
                  })
            });

            return {
                Days : data.forecast.forecastday,
                minTemp : firstForecastDay.day.mintemp_c,
                maxTemp : firstForecastDay.day.maxtemp_c,
            }
          } else {
            // Handle the case when forecastData.forecast.forecastday is empty
            return {
              fMinTemp: undefined,
              fMaxTemp: undefined,
              fhours: []
            };
          }
        }),//tap(data => console.log("Forecast: ", data))
      );
    })
  );

  vm$ = combineLatest([this.forcast$, this.current$]).pipe(
    //Obs that is taking two obs and putting them into an array, making things more ordered for console.log
    map(([forecast, current]: any) => {
      
      return {
        forecast, current
      }
    }),
    tap((data) => console.log('Combined: ', data)),
  );

  //.subscribe((data: any) => {
  //   this.data = data;
  // })

  constructor(
    private cycle: CycleServiceService,
    private web: WebRequestService,
    public api: ApiService,
    private route: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // this.web.get(this.town).subscribe((data: any) => {
    //   this.data = data;
    // })

    // this.getForcast()

    console.log('data: ', this.data);

    //inputing data into behaviourSubject to start obs cycle 
    this.params$.next(this.data);
    this.cycle.login == false

  }

  //method that makes use of the cycle service
  // setClass() {
  //   this.cycle.cycle(false)
  // }

//  formattime(date: Date): string {
//     if (date.getMinutes() < 10) {
//       return date.getHours() + ':0' + date.getMinutes();
//     }
//     return date.getHours() + ':' + date.getMinutes();
//   }

  // getForcast() {
  //   this.cycle.getData('forecast', {q: 'London', days: '1', aqi: 'no'})

  // }

  add() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to add Location?',
      accept: () => {
          this.api.addLocation(this.data)
        },
        reject: () => {
          
          console.log('no')
      }

  });
  }

  goBack() {
    this.route.navigate(["/main/explore"])
  }
}


