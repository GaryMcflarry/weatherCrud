import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ExploreComponent } from './explore/explore/explore.component';
import { ProfileComponent } from './profile/profile/profile.component';


const routes: Routes = [
  {path: '', component: MainComponent},
{path: 'explore', component: ExploreComponent},
//used for the locations that are seleted by the cards
//there is a check on explore component that will route to weather-display 
{path: 'explore/:location', component: ExploreComponent},
{path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { 

}
