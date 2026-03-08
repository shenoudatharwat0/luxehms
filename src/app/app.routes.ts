import {Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {ReservationsComponent} from './reservations.component';
import {FrontDeskComponent} from './front-desk.component';
import {HousekeepingComponent} from './housekeeping.component';
import {GuestsComponent} from './guests.component';
import {BillingComponent} from './billing.component';
import {ReportsComponent} from './reports.component';
import {SettingsComponent} from './settings.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'front-desk', component: FrontDeskComponent },
  { path: 'housekeeping', component: HousekeepingComponent },
  { path: 'guests', component: GuestsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent }
];
