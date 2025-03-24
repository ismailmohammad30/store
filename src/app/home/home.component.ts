import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private route: Router) { }

  ngOnInit(): void {
  }
  products() {
    return this.route.navigate(['products']);
  }
  scrollToLearnMore() {
    const element = document.getElementById('learnMore');
    element?.scrollIntoView({ behavior: 'smooth' });
}
}
