import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public input: any;
  invalidLogin: boolean;
  verified: boolean;

  public constructor(private router: Router, private authService: AuthService) {
    this.input = {
      'email': '',
      'password': ''
    };

    this.invalidLogin = false;
    this.verified = true;
  }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm): void {
    const user: User = new User(this.input.email.toLowerCase(), this.input.password);

    this.authService.login(user).subscribe(value => {

      if (!this.authService.currentUser.isVerified()) {
        this.verified = false;
        this.authService.logout();
        return;
      }

      this.router.navigate(['/home']);
    }, error => {
      this.invalidLogin = true;
    });
  }

  resendVerificationEmail(): void {
    if (this.authService.currentUser != null) {
      this.authService.resendVerificationEmail(this.authService.currentUser).subscribe(value => {
        this.verified = true;
      });
    }
  }
}
