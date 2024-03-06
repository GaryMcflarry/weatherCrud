import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { WeatherDisplayComponent } from "./weather-display/weather-display/weather-display.component";
import { MainComponent } from "./main.component";
import { SidebarModule } from "primeng/sidebar";
import { CommonModule, DatePipe } from "@angular/common";
import {  ScrollPanelModule } from "primeng/scrollpanel";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from "@angular/router";
import { MainRoutingModule } from "./main-routing.module";
import { DividerModule } from 'primeng/divider';
import { ExploreComponent } from './explore/explore/explore.component';
import { CardModule } from 'primeng/card';
import { CardComponent } from './explore/card/card.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from "primeng/api";
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileComponent } from './profile/profile/profile.component';
import {MatButtonModule} from '@angular/material/button';

//Main module created due to the fact that the main component houses the weather-display one when using <weather-display></weather-display>
//everything that the two components need will be placed here and removed from the app module

@NgModule({
  declarations: [
    MainComponent,
    WeatherDisplayComponent,
    ExploreComponent,
    CardComponent,
    ProfileComponent,
    
  ],
  imports: [
    SidebarModule,
    CommonModule,
    ScrollPanelModule,
    AccordionModule,
    ButtonModule,
    PaginatorModule,
    RouterModule,
    MainRoutingModule,
    CardModule,
    DividerModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    InputTextModule,
    MatButtonModule

  ],
  providers: [
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MainModule { }
