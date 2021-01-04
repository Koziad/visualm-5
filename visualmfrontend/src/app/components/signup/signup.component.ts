import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfigService} from '../../services/app-config.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signup: any;
  public creationFailed = false;
  emailCheck: boolean = false;
  onSubmitForm: boolean = false;
  private config = {
    email_suffix: '',
    organisation: ''
  };

  @ViewChild('f')
  private form: NgForm;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private configService: AppConfigService) {
    this.signup = {
      'firstname': '',
      'lastname': '',
      'organisation': '',
      'email': '',
      'password': '',
      'passwordRepeat': ''
    };

    this.configService.getAll().subscribe(config => {
      this.config.email_suffix = config.email_suffix;
      this.config.organisation = config.organisation;
      this.signup.organisation = config.organisation;
    });
  }

  ngOnInit(): void {
  }

  onChange(): void {
    const email = this.form.controls.Email.value;

    if (!email.trim().endsWith(`@${this.config.email_suffix}`)) {
      this.form.controls.Email.setErrors({incorrect: true});
    } else {
      this.form.controls.Email.setErrors(null);
    }
  }

  onSubmit(f: NgForm): void {
    if (!f.valid) {
      return;
    }
    this.onSubmitForm = true;
    const user: User = new User(this.signup.email.toLowerCase(), this.signup.password, 0, this.signup.firstname,
      this.signup.lastname, this.signup.organisation);

    this.snackBar.open('Check your email for the verification link', 'Close', {
      duration: 10000,

      horizontalPosition: 'center', verticalPosition: 'bottom'
    });

    this.authService.signup(user).subscribe(data => {
      this.creationFailed = false;
      this.router.navigate(['/login']);
    }, error => {
      this.onSubmitForm = false;
      this.emailCheck = true;
      this.creationFailed = true;
    });
  }

}
