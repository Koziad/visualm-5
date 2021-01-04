import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgForm} from "@angular/forms";
import {User} from '../../models/user';
import {Token} from "../../models/token";
import {Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private token: Token;
  verified: boolean;
  public input: any;
  queryParamSubscription: Subscription;
  users: User;
  edit: any;
  emailValid: boolean;
  emailWaiting: boolean;
  emailInvalid: boolean;
  passwordEquels: boolean;
  errorMessage: any;
  errorOccurred: boolean;
  passwordEquelsOccurred: boolean;
  passwordMessage: any;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, public userService: UserService, public authService: AuthService) {
    this.input = {
      'email': ''
    };
  }

  onSubmit(f: NgForm) {

    this.emailWaiting = true;
    this.emailValid = false;
    this.emailInvalid = false;

    this.input.password


    const user: User = new User(this.input.email.toLowerCase());

    this.authService.requestResetPassword(user).subscribe(data => {
      const user: User = Object.assign(new User(), data);
      if (user.getEmail() === undefined) {
        this.emailWaiting = false;
        this.emailValid = true;
      }
    }, error => {
      console.log(error);
      this.emailWaiting = false;
      this.emailInvalid = true;
    });
  }

  ngOnInit(): void {
    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe(value => {

      this.authService.getVerificationToken(value.token).subscribe(token => {
        this.token = Token.trueCopy(token);
        this.verified = this.token.getUser().isVerified();

        this.verified = true;


      });
    });
  }

  reset() {

    const email = this.token.getUser().getEmail().toLowerCase();
    const id = this.token.getUser().getId()

    if (this.input.password != this.input.comparisonPassword) {
      this.passwordEquelsOccurred = true;
      this.passwordMessage = " The passwords are not equeal to eachother "
    } else {
      const user: User = Object.assign(new User(email, this.input.password, id, this.token.getUser().getFirstname(), this.token.getUser().getLastname(), this.token.getUser().getOrganisation(), this.token.getUser().isAdmin(), this.token.getUser().isVerified()));

      this.authService.resetPassword(this.token.getTokenValue(), user).subscribe(data => {

        this.router.navigate(['/login']);


      }, error => {

        this.errorOccurred = true;

        console.log(error);
        if (error.error.message === 'Can not have the same password') {
          this.errorMessage = error.error.message;
        }

      });
    }
  }
}

