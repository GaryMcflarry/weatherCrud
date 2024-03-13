import { Component } from '@angular/core';
import { interval, map, startWith, tap } from 'rxjs';
import { CycleServiceService } from 'src/app/services/cycle-service.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
    private cycle: CycleServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService
  ) {}

  formSignUp = this.formBuilder.group({
    username: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        //regex being used as a way of checking the format of a email
        // Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ])
    ),
    password: new FormControl('', Validators.compose([Validators.required])),
  });

  borderCol = '';

  border$ = interval(60_000).pipe(
    startWith('Starting timer'),
    tap((data) => console.log('border timer:', data)),
    map(() => {
      if (this.cycle.CSSclass == 'morning') {
        this.borderCol = 'morning';
        return this.borderCol;
      } else if (this.cycle.CSSclass == 'midday') {
        this.borderCol = 'midday';
        return this.borderCol;
      } else if (this.cycle.CSSclass == 'afternoon') {
        this.borderCol = 'afternoon';
        return this.borderCol;
      } else {
        this.borderCol = 'night';
        return this.borderCol;
      }
    })
  );

  signUp() {
    console.log('Form Signup:', this.formSignUp.value);
    if (this.formSignUp.valid) {
      this.api.signUpUser(this.formSignUp.value);
    }
  }

  goBack() {
    this.router.navigate(['/auth']);
  }
}
