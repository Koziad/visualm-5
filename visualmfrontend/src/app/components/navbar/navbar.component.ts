import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NavigationEnd, Router} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {share} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public user: User;
  mySubscription: any;
  private updatedUserSubscription: Subscription;

  constructor(public userService: UserService, private router: Router, private authService: AuthService) {
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.user = this.authService.currentUser;
        this.getUserProfile();
      }
    });

    this.updatedUserSubscription = this.userService.updatedUser.pipe(share()).subscribe(updatedUser => {
      if(updatedUser != null) {
        if (this.user.getId() === updatedUser.getId()) {
          this.user = updatedUser;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }

    this.updatedUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.authService.logout();
    this.userService.updatedUser.next(null);
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.currentUser && this.authService.isAdmin();
  }

  getUserProfile(): void {
    if (this.user != null && this.authService.isLoggedIn()) {
      this.userService.getUserProfile(this.user.getId()).subscribe(data => {
        this.user = Object.assign(new User(), data);
      }, error => {
        console.log(error);
      });
    }
  }
}
