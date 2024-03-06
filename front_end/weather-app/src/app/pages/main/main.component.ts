import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { interval, map, startWith, tap } from 'rxjs';
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
  @ViewChild("SwiperEl") swiperEl : any



  constructor(private cycle: CycleServiceService, public router: Router, public api : ApiService) {}

  menuCol$ = interval(60_000).pipe(
    startWith('Starting timer'),
    tap(data => console.log("menu color: " , data)),
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

  //like ngOnInit but only occurs once the browsers rendering of the component is complete 
  ngAfterViewInit() {
    register()

    //something to do with the view child, showing the options avialable to the slider container
    //console.log("Swiper: " , this.swiperEl)
    // this.swiperEl.nativeElement.addEventListener

    // this.swiperEl.add
  }

  //the first thing to auto occur during the process of rendering the component
  ngOnInit() {
    // this.cycle.cycle(false)

    //using the cycle service to determine the appropriate color of the sidebar
    
  }

  //testing to see if the activeIndex does change with a swipe (it does)
  // swiperTest() {
  //   console.log(this.swiperEl.nativeElement.swiper.activeIndex)
  // }

  //routing back to the login component
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
