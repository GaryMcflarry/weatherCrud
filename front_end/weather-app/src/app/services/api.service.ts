import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { tap, map, catchError, throwError, BehaviorSubject, switchMap, combineLatest, filter} from 'rxjs'
import { jwtDecode } from "jwt-decode";
import { StorageService } from './storage.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { response } from 'express';
//small array to map days of week to index num for forecast obs

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private web: WebRequestService, 
    private store: StorageService, 
    private message: MessageService, 
    public router: Router, ) { }

    


    

  // storeToken(token: any) {
  //   this.store.setItem('Token', token)
  //   this.user$.next(this.getToken())
  // }

  getToken() {

    return this.decrypt(this.store.getItem('Token'))                  //METODS FOR OBTAINING AND USING TOKEN!!!!!
  }
  decrypt(token: any) {
    return this.decipherToken(jwtDecode(token))
  }
  decipherToken(info : any) {
     console.log('decrypted token info (LETS GOOOOOOO)' , info)
    return info
  }
  // getUserInfo() {
  //   return this.getToken().userId
  // }

  expMessage(message: string) {
    this.message.add({ severity: 'error', summary: 'Error', detail: message , life: 3000 });
  }

//---------------------------------------------------------------------------------------------------------------------------------------------------------



  // making use of a behaviour subject obs, the way that i am using it is that it is a object that can house a defaut 
  // value but once we add a new value to it (.next('')) it can trigger other observable that can make use of that value
  // These obs can return the edited info (.pipe()) and be use however I see fit
  // either through HTML (*ngIF or *ngFor) ot ts (.subscribe()) 
  private user$ = new  BehaviorSubject<any>('Default')
  //obs using user$                                                         //OBS AND METHOD FOR GETTING INFO FROM LOGIN AND SENDING IT TO
                                                                            //WEATHER-DISPLAY THROUGH MAIN COMPONENT AND CARD COMPONENT THROUGH EXPLORE PAGE
  user = this.user$.asObservable().pipe(
    tap((data : any) => console.log('user', data)),
    map((data: any) => {
      //can use this info
      return {locations : data.locations}

    }),
    // tap((data: any) => console.log('user', data))
  )
  //inputing new value into behaviourSubject obs, and storing newly created token
  MaintainUser(token: any) {
    this.store.setItem('Token',token)
    this.user$.next(this.getToken())
  }



//---------------------------------------------------------------------------------------------------------------------------------------------------------



  userLogin(info : any) {

    this.web.mongoPost('users/login', info).pipe(
      catchError(error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No Authorization', life: 3000 });
        return throwError(error)
      })
    ).subscribe((response: any) => {
        if (response.success == true) {
           this.message.add({ severity: 'success', summary: 'Success', life: 3000 });
          console.log('Login Request:', response)
          //sending to obs in the userService
          this.MaintainUser(response.data.token)
          // this.MaintainUser(this.getToken())
          // this.userservice.transfer(response.data)
          this.router.navigate(['/main'])
        }

    })


  }

  logOut() {
    this.store.removeItem('Token')
    this.router.navigate(['/auth/login'])
  }

  searchLocation_(info :any) {
    return this.web.get('search', info).pipe ( 
      map((data: any) => {

        return data.map((element : any) => 
           ({location : element.name,
            lat: element.lat,
            lon: element.lon,
            coordinates: `${element.lat}, ${element.lon}`})
        )
      }),tap((data: any) => {console.log("search api; ", data)}),
    )
  }

  // searchLocation(info :any) {
  //   this.web.get('search', info.search).pipe(
  //     tap((data: any) => console.log(data))
  //   ).subscribe(
  //     (response: any) => {
  //       // Handle the response data here
  //       this.router.navigate([`main/explore/${response[0].name}`])
  //     },
  //     (error: any) => {
  //       // Handle any errors that occur during the HTTP request
  //       console.error("Error:", error);
  //     }
  //   );
  // }
                                                                      //METHODS FOR HANDLING THE LOGIN AND SIGNUP REQUESTS
  
signUpUser(info : any) {

    console.log('Form Sign up: ', info)
      this.web.mongoPost('users/signup', info).pipe(
        catchError(error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'User Exists', life: 3000 });
        return throwError(error);
      }))
      .subscribe((response: any) => {
        if (response.success == true) {
          this.message.add({ severity: 'success', summary: 'Success', detail: 'You can log in!!!', life: 3000 });
          console.log('signup request:', response)
        } 
      })

  }

  present: Boolean = false

  removeAcc(info: string) {
    this.web.mongoPost(`users/remove`, {_id : info}).pipe(
      catchError(error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Unexpected :o', life: 3000 });
        this.logOut();
        return throwError(error)
     
      })
    ).subscribe((response:any) => {
      this.message.add({ severity: 'success', summary: 'Success', detail: response.message , life: 3000 });
      console.log('remove request:', response)
    })
  }

  addLocation(info: string) {
     const userObj = this.user$.getValue()
     console.log("locations", userObj)
     userObj.locations.forEach((element : any) => {
      console.log("element", element)
      if (info == element) {
        this.present = true
      }
    })

    if (this.present) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Location already added', life: 3000 });
    }
    else {
      this.web.mongoPost(`users/${this.getToken().userId}/addLocation`, { locations: info}).pipe(
        catchError(error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Unexpected :o', life: 3000 });
        this.logOut();
        return throwError(error)
      })
    ).subscribe((response: any) => {
        if (response.success == true) {
           this.message.add({ severity: 'success', summary: 'Success', detail: 'Location was added' , life: 3000 });
          console.log('add request:', response)
          this.MaintainUser(response.data.token)
          
          //console.log(response.user)
          this.router.navigate(['/main'])
        }

    })
    }
  }

  
  removeLocation(info: string) {
      this.web.mongoPost(`users/${this.getToken().userId}/removeLocation`, { locations: info}).pipe(
        catchError(error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Unexpected :o', life: 3000 });
        this.logOut();
        return throwError(error)
      })
    ).subscribe((response: any) => {
        if (response.success == true) {
           this.message.add({ severity: 'success', summary: 'Success', detail: response.message , life: 3000 });
          console.log('remove request:', response)
          this.MaintainUser(response.data.token)
        }

    })
  }

}
