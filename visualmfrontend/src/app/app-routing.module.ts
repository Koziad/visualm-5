import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {MaterialFormComponent} from './components/materials/material-form/material-form.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AdminComponent} from './components/admin/admin.component';
import {SearchComponent} from './components/search/search.component';
import {MaterialComponent} from './components/materials/material/material.component';
import {EditMaterialFormComponent} from './components/materials/edit-material-form/edit-material-form.component';
import {MailVerificationComponent} from './components/mail-verification/mail-verification.component';
import {AuthGuard} from './guards/auth.guard';
import {AuthAdminGuard} from './guards/auth-admin.guard';
import {ErrorComponent} from './components/error/error.component';
import {AboutComponent} from './components/about/about.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: SearchComponent},
  {path: 'materials/create', component: MaterialFormComponent, canActivate: [AuthGuard]},
  {path: 'material/:sequence_number', component: MaterialComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'my-profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'user/:id', component: ProfileComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AuthAdminGuard]},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'verify-email', component: MailVerificationComponent},
  {path: 'materials/edit/:sequence_number', component: EditMaterialFormComponent},
  {path: 'about', component: AboutComponent},
  {path: 'materials/edit/:sequence_number', component: EditMaterialFormComponent, canActivate: [AuthGuard]},
  {path: '**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
