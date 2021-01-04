import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Token} from '../../models/token';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit, OnDestroy {
  private token: Token;
  verified: boolean;
  errorOccurred: boolean;
  errorMessage: string;
  queryParamSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.errorOccurred = false;
    this.errorMessage = 'Try again later or contact the admin of the site';
  }

  ngOnInit(): void {
    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe(value => {
      if (!value.token) {
        this.router.navigate(['/login']);
      }

      this.authService.getVerificationToken(value.token).subscribe(token => {
        this.token = Token.trueCopy(token);
        this.verified = this.token.getUser().isVerified();

        // Redirect already registered users
        if (this.verified) {
          this.redirectAfterDelay();
        }
      }, error => {
        this.errorOccurred = true;

        if (error.error.status === 401 && error.error.path === '/auth/verify') {
          this.errorMessage = 'The token has already expired.';
          this.redirectAfterDelay();
        }

        if (error.error.status === 401 && error.error.message === 'The token provided is invalid') {
          this.errorMessage = error.error.message;
          this.redirectAfterDelay();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
  }

  verifyEmail(): void {
    this.authService.verifyEmailByToken(this.token.getUser().getId(), this.token).subscribe(value => {
      this.router.navigate(['/login']);
    });
  }

  private redirectAfterDelay(): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);
  }
}
