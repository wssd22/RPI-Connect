import { Component, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() homeShow: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
