import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import {
  tap,
  map,
  catchError,
  throwError,
  BehaviorSubject,
  interval,
  startWith,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from './storage.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { response } from 'express';
//small array to map days of week to index num for forecast obs

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private web: WebRequestService,
    private store: StorageService,
    private message: MessageService,
    public router: Router
  ) {}

  //METODS FOR OBTAINING AND USING TOKEN!!!!!
  //========================================================================================================

  getToken() {
    return this.decrypt(this.store.getItem('Token'));
  }
  decrypt(token: any) {
    return this.decipherToken(jwtDecode(token));
  }
  decipherToken(info: any) {
    //console.log('decrypted token info (LETS GOOOOOOO)' , info)
    return info;
  }

  //========================================================================================================

  //Message for AFK expiration
  expMessage(message: string) {
    this.message.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }

  //Checking token expiration every min
  tokenExp$ = interval(60_000).pipe(
    startWith('Starting timer'),
    //tap((data) => console.log('tokenExp$', data)),
    map((data) => {
      const epoch = new Date().getTime() / 1000;
      //console.log('Exp Time:', this.getToken().exp);
      //console.log('Epoch Time: ', epoch);
      if (this.getToken().exp < epoch) {
        this.expMessage('Session Has Expired');
        this.logOut();
      }
    })
  );

  //========================================================================================================

  // making use of a behaviour subject obs, the way that i am using it is that it is a object that can house a defaut
  // value but once we add a new value to it (.next('')) it can trigger other observables that can make use of that value
  // These obs can return the edited info (.pipe()) and be use however I see fit
  // either through HTML (*ngIF or *ngFor) ot ts (.subscribe())

  private user$ = new BehaviorSubject<any>('Default');

  user = this.user$.asObservable().pipe(
    //tap((data: any) => console.log('user', data)),
    map((data: any) => {
      //can use this info
      return { locations: data.locations, username: data.username };
    })
    // tap((data: any) => console.log('user', data))
  );

  //inputing new value into behaviourSubject obs, and storing newly created token
  MaintainUser(token: any) {
    this.store.setItem('Token', token);
    this.user$.next(this.getToken());
  }

  //========================================================================================================

  logOut() {
    this.store.removeItem('Token');
    this.router.navigate(['/auth']);
  }

//========================================================================================================

//WEATHER API SEARCH METHOD

  searchLocation_(info: any) {
    return this.web.get('search', info).pipe(
      map((data: any) => {
        return data.map((element: any) => ({
          location: element.name,
          lat: element.lat,
          lon: element.lon,
          coordinates: `${element.lat}, ${element.lon}`,
        }));
      }),
      //tap((data: any) => {console.log('search api; ', data);})
    );
  }

//========================================================================================================

//USER CRUD METHODS

  userLogin(info: any) {
    this.web
      .mongoPost('weather/login', info)
      .pipe(
        catchError((error) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No Authorization',
            life: 3000,
          });
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        if (response.success == true) {
          this.message.add({
            severity: 'success',
            summary: 'Success',
            life: 3000,
          });
          //console.log('Login Request:', response);
          //sending to obs in the userService
          this.MaintainUser(response.data.token);
          // this.MaintainUser(this.getToken())
          // this.userservice.transfer(response.data)
          this.router.navigate(['/main']);
        }
      });
  }

  signUpUser(info: any) {
    //console.log('Form Sign up: ', info);
    this.web
      .mongoPost('weather/signup', info)
      .pipe(
        catchError((error) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User Exists',
            life: 3000,
          });
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        if (response.success == true) {
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You can log in!!!',
            life: 3000,
          });
          this.router.navigate(['/auth']);
          //console.log('signup request:', response);
        }
      });
  }

  removeAcc(info: string) {
    this.web
      .mongoPost(`weather/remove`, { userId: info })
      .pipe(
        catchError((error) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unexpected :o',
            life: 3000,
          });
          this.logOut();
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
          life: 3000,
        });
        //console.log('remove request:', response);
      });
  }

  present: Boolean = false;

  addLocation(info: string) {
    const userObj = this.user$.getValue();
    //console.log('locations', userObj);
    userObj.locations.forEach((element: any) => {
      //console.log('element', element);
      if (info == element) {
        this.present = true;
      }
    });
    if (this.present) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Location already added',
        life: 3000,
      });
    } else {
      this.web
        .mongoPost(`weather/${this.getToken().userId}/addLocation`, {
          locations: info,
        })
        .pipe(
          catchError((error) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unexpected :o',
              life: 3000,
            });
            this.logOut();
            return throwError(error);
          })
        )
        .subscribe((response: any) => {
          if (response.success == true) {
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Location was added',
              life: 3000,
            });
            //console.log('add request:', response);
            this.MaintainUser(response.data.token);
            //console.log(response.user)
            this.router.navigate(['/main']);
          }
        });
    }
  }

  removeLocation(info: string) {
    this.web
      .mongoPost(`weather/${this.getToken().userId}/removeLocation`, {
        locations: info,
      })
      .pipe(
        catchError((error) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unexpected :o',
            life: 3000,
          });
          this.logOut();
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        if (response.success == true) {
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
            life: 3000,
          });
          //console.log('remove request:', response);
          this.MaintainUser(response.data.token);
        }
      });
  }

//========================================================================================================

}
