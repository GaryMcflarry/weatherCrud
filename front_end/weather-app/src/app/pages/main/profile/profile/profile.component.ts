import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(
    public api: ApiService,
    public confirmationService: ConfirmationService,
    private router: Router
  ) {}

  username: string = this.api.getToken().username;

  goBack() {
    this.router.navigate(['/main']);
  }

  remove(location: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove Location?',
      accept: () => {
        console.log('YES');
        this.api.removeLocation(location);
      },
      reject: () => {
        console.log('no');
      },
    });
  }

  removeAccount() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove Account?',
      accept: () => {
        console.log('YES');
        console.log("ID", this.api.getToken().userId)
        this.api.removeAcc(this.api.getToken().userId);
        this.api.logOut()
      },
      reject: () => {
        console.log('no');
      },
    });
  }
}
