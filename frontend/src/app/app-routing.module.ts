import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'schedule', component: SchedulePageComponent },
  { path: 'admin', component: AdminPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
