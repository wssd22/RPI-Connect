import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})
export class ProfileComponent implements OnInit {
  @Input() profileShow: boolean = false;
  @Input() profileId:number = 0;

  @Output() loginSend = new EventEmitter();

  name:string = "";
  year:string = "";
  email:string = "";
  discord:string = "";
  private data:any = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  

  public loadProfile(id:number){
    this.profileId = id;
    this.httpService.sendGetRequest("user/" + this.profileId.toString()).subscribe((res) => {
      this.data = res;
      
      this.name = this.data.name;

      this.year = this.data.gradYr;
      this.email = this.data.email;
      this.discord = this.data.discord;
      //read in classes
      var current = "";
      var currentList = document.getElementById("currentList");
      for(var i = 0; i < this.data.current.length; i++){
        current += "<li>" + this.data.current[i] + "</li>";
      }
  
      (<HTMLElement>currentList).innerHTML = current;

      var prev = "";
      var prevList = document.getElementById("prevList");
      for(var i = 0; i < this.data.prev.length; i++){
        prev += "<li>" + this.data.prev[i] + "</li>";
      }
      (<HTMLElement>prevList).innerHTML = prev;
      //read in requests
    });
  }

}
