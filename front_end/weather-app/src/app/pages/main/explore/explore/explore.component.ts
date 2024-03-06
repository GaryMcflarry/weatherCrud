import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  interval,
  map,
  of,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CycleServiceService } from 'src/app/services/cycle-service.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent {
  //checking to see if the params has any value (the name of the location)
  params$ = this.activated.params.pipe(
    map((data: any) => (Object.keys(data).length > 0 ? data : null))
  );

  //combining two obs to make use of them in the html
  vm$ = combineLatest([this.api.user, this.params$]).pipe(
    map(([user, params]) => {
      // console.log(user)
      const suggested = this.suggestedlocations.filter(
        (x) =>
          // console.log("x =>" , x)
          // console.log("index =>" , user.locations.indexOf(x))
          // return
          //making use of newly created array called suggested that will only house suggested locations that are not in the users locations array
          user.locations.indexOf(x) == -1
        // }
      );
      // console.log("sugg =>" , suggested)
      return { user, params, suggested };
    })
  );

  sidebarVisible!: boolean;
  menuCss = '';

  visible!: boolean;

  sLocation!: string;

  // formSearch = this.formBuilder.group({
  //   search: new FormControl('', Validators.compose([Validators.required])),
  // });

  showDialog() {
    this.visible = true;
  }

  constructor(
    public cycle: CycleServiceService,
    private router: Router,
    public api: ApiService,
    private activated: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  //array of suggested locations
  suggestedlocations = [
    'Santiago',
    'Lisbon',
    'Buenos aires',
    'Cairo',
    'Cape Town',
    'Lagos',
    'Bangkok',
    'New York',
    'Thabazimbi',
    'Standerton',
  ];

  routeMenu() {
    this.router.navigate(['/main']);
  }

  locationSearch = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.minLength(3)])
  );
  // locationSearch = new BehaviorSubject<any>('')

  // fork = forkJoin({

  //   lat_lonResults: this.locationSearch.valueChanges.pipe(
  //     // tap((data: any) => console.log("Ds:", data)),
  //     debounce(() => timer(1000)),
  //     tap((data: any) => console.log('lon/lon Ds:', data)),
  //     switchMap((data: any) => {
  //       if (data) {
  //       return this.api
  //         .searchLocation_(data)
  //         .pipe(
  //           tap((search: any) => console.log('lan/lon Ds response:', search)),
  //           map((data: any)=> {

  //             let locations = data.map((x: any) => `${x.lat}, ${x.lon}`)
  //             return locations
  //           })
  //           );
  //         } else {
  //           return data;
  //         }
  //     }),
  //     tap((data: any) => console.log('lan/lon api searchField:', data)),
  //   ),

  //   nameResults: this.locationSearch.valueChanges.pipe(
  //     // tap((data: any) => console.log("Ds:", data)),
  //     debounce(() => timer(1500)),
  //     tap((data: any) => console.log('name Ds:', data)),
  //     switchMap((data: any) => {
  //       if (data) {
  //       return this.api
  //         .searchLocation_(data)
  //         .pipe(
  //           tap((search: any) => console.log('nameSearch response:', search)),
  //           map((data: any)=> {

  //             return data.region
  //           })
  //           );
  //         } else {
  //           return data;
  //         }
  //     }),
  //     tap((data: any) => console.log('name searchField:', data)),
  //   ),

  // })

  searchResults = this.locationSearch.valueChanges.pipe(
    debounce(() => timer(1000)),
    tap((data: any) => console.log('Ds:', data)),
    switchMap((data: any) => {
      if (data.length >= 3) {
        return this.api.searchLocation_(data).pipe(
          tap((search: any) => console.log('Ds response:', search)),
          map((data: any) => {
            console.log(data);
            if (data.length === 0) {
              return ({
                data: data,
                error: true,
                message: 'Cannot find Location',
              });
            } else {
              // let locations = `${data.lat}, ${data.lon}`
              return {
                data: data,
                error: false,
                message: 'Location Found!!!',
              };
            }
          })
        );
      } else {
        return of({
          data: data,
          error: true,
          message: 'Require more characters',
        });
      }
    }),
    // tap((search: any) => console.log('Ds response:', search)),
    // map((data: any) => {
    //   if (data.length === 0) {
    //       this.errMessage = 'Enter more Characters please :('
    //   return null
    //   }else {
    //     return data
    //   }
    // }),
    tap((data: any) => console.log('return:', data))
  );

  // search() {
  //   console.log('form search: ', this.formSearch.value);
  // }

  menuCol$ = interval(60_000).pipe(
    startWith('Starting timer'),
    tap((data) => console.log('menu explore color: ', data)),
    map(() => {
      if (this.cycle.CSSclass == 'midday') {
        this.menuCss = 'bg-cyan-500';
      } else if (this.cycle.CSSclass === 'morning') {
        this.menuCss = 'bg-teal-500';
      } else if (this.cycle.CSSclass === 'afternoon') {
        this.menuCss = 'bg-pink-400';
      } else {
        this.menuCss = 'bg-indigo-400';
      }

      return this.menuCss;
    })
  );

  ngOnInit() {}

  logOut() {
    this.api.logOut()
  }

  profile() {
    this.router.navigate(['main/profile']);
  }
}
