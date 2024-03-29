import { Component } from '@angular/core';
import { CycleServiceService } from 'src/app/services/cycle-service.service';
import {  FormBuilder, Validators, FormControl } from "@angular/forms";
import { ApiService } from 'src/app/services/api.service';
import { interval, map, startWith, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {

  //still need to do form control for login
  formLogin = this.formBuilder.group({
    username : new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(10)
      //regex being used as a way of checking the format of a email
      // Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required
    ]))
  });

  //varialble used to make use of the correct logo depending on the time of day
  image: string | undefined;
  //used for the cycle service
  hour!: number
  
  constructor(private cycle: CycleServiceService, public formBuilder: FormBuilder, private api: ApiService, private router: Router) {}


  //making use of the service to the determine the accurate logo
  logo$ = interval(60_000).pipe(
    startWith('Starting timer'),
    tap(data => console.log('logo timer:', data)),
    map(() => {
      if (this.cycle.CSSclass == 'morning' || this.cycle.CSSclass == 'midday' || this.cycle.CSSclass == 'afternoon') {
        this.image = "assets/images/day_logo.png"
        return this.image
     } else {
       this.image = "assets/images/night_logo.png"
       return this.image
     }
    })
    )
  
  ngOnInit() {}

  // logForm(){
  //   console.log('Form Login: ', this.formLogin.getRawValue())
  //   console.log('Form Login: ', this.formLogin)

  // }

  loginUser() {
    console.log('Form Login: ', this.formLogin.value)
    //using form control to log in and depending on the outcome dealling with the response
    if (this.formLogin.valid) {
        this.api.userLogin(this.formLogin.value)
    }
  }

  // showtoast() {
  //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You can log in!!!', life: 3000 });
  // }

  signup() {
    this.router.navigate(['auth/signup']);
  }


}



