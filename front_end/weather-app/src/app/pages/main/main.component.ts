import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { combineLatest, interval, map, startWith, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CycleServiceService } from 'src/app/services/cycle-service.service';
import {register} from 'swiper/element/bundle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})

export class MainComponent {
  //variable used for indicating the state of the sidebar
  sidebarVisible!: boolean;
  //variable name used for indicating the certian sidebar color to dictate the time of the day
  menuCss = ''

  //explanation is required
  //I believe is carries data on the swiper.js used in the main component
  @ViewChild("SwiperEl") swiperEl : any

  constructor(private cycle: CycleServiceService, public router: Router, public api : ApiService) {}

  //Timer to keep accurate menu color based of the hour of day
  menuCol$ = interval(60_000).pipe(
    startWith('Starting timer'),
  //tap(data => console.log("menu color: " , data)),
    map(() => {
      if (this.cycle.CSSclass == "midday") {
        this.menuCss= 'bg-cyan-500';
     } else if (this.cycle.CSSclass === 'morning') {
       this.menuCss = 'bg-teal-500';      
     } else if (this.cycle.CSSclass === 'afternoon') {
       this.menuCss = 'bg-pink-400'
     } else {
       this.menuCss = 'bg-indigo-400'
     }
     return this.menuCss
    })
  )

  //Combined OBS to keep track of menu color aswell as keeping track of token exp time
  vm$= combineLatest([this.menuCol$, this.api.tokenExp$]).pipe(
    map(([menu, tokenExp ]) => {
        return{menu, tokenExp}
    })
  )

  //like ngOnInit but only occurs once the browsers rendering of the component is complete 
  ngAfterViewInit() {
    register()
  }

  //the first thing to auto occur during the process of rendering this component
  //ngOnInit() {}

  logOut() {
    this.api.logOut()
  }

  explore() {
    this.router.navigate(['/main/explore'])
  }

  profile () {
    this.router.navigate(['main/profile'])
  }

}
