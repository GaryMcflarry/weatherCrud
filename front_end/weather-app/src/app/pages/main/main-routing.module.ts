import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ExploreComponent } from './explore/explore/explore.component';
import { ProfileComponent } from './profile/profile/profile.component';

//Routing for main/...
const routes: Routes = [
{path: '', component: MainComponent},
{path: 'explore', component: ExploreComponent},
//Params for location display for explore component
{path: 'explore/:location', component: ExploreComponent},
{path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { 

}
