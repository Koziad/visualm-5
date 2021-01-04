import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {MaterialFormComponent} from './components/materials/material-form/material-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AdminComponent} from './components/admin/admin.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {DialogBoxComponent} from './components/admin/dialog-box/dialog-box.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ProfilePictureUploadComponent} from './components/profile/profile-picture-upload/profile-picture-upload.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MaterialComponent} from './components/materials/material/material.component';
import { SearchComponent } from './components/search/search.component';
import { EditMaterialFormComponent } from './components/materials/edit-material-form/edit-material-form.component';
import {MailVerificationComponent} from './components/mail-verification/mail-verification.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {MaterialsService} from './services/materials.service';
import { ErrorComponent } from './components/error/error.component';
import {AboutComponent} from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MaterialFormComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    AdminComponent,
    DialogBoxComponent,
    FileUploadComponent,
    ProfileComponent,
    SearchComponent,
    ProfilePictureUploadComponent,
    MaterialComponent,
    EditMaterialFormComponent,
    MailVerificationComponent,
    ErrorComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxQRCodeModule,
    HttpClientModule,
    NgbModule,
    ImageCropperModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    MaterialsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
