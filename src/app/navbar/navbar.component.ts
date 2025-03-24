import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUser:any;
  isMenuActive = false;

  constructor(
    private af:AngularFireAuth,
    private Route:Router,
    private sa:AuthService
  ) { 
    this.sa.user.subscribe((user) => {
      if (user) {
        this.isUser = user;
      }
      else {
        this.isUser = false;
      }
    });
  }

  ngOnInit(): void {
  }
  logout() {
    this.af.signOut().then(() => {
      console.log('logged out');
      this.Route.navigate(['/login']);
    });
  }
  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
  closeMenu() {
    this.isMenuActive = false;
  }

}
