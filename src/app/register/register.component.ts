import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private sa:AuthService, private fs:AngularFirestore, private Route:Router) { }

  ngOnInit(): void {
  }
  register(f:any) {
    let data = f.value;
    this.sa.signUp(data.email, data.password).then((user) => {
      this.fs.collection('users').doc(user.user.uid).set({
        name: data.name,
        email: data.email,
        password: data.password,
        bio: data.bio,
        uid: user.user.uid
      })
      console.log('Registration success');
      this.Route.navigate(['/home']);
    })
    .catch((err) => {
        console.log('Error:', err);
    });
}
}
