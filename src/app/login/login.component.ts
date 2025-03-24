import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private sa:AuthService , private route:Router) {}
  

  ngOnInit(): void {
  }
  Error: string = '';
  login(f : any) {
    let data = f.value;
    this.sa.signIn(data.email, data.password)
      .then(() => {
        this.route.navigate(['home']);
      })
      .catch(() => {
        this.Error = 'Invalid email or password';
      })
  }
}
